/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import AzureADProvider from "next-auth/providers/azure-ad"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import config from "@/config"

const pool = new Pool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	ssl: process.env.DATABASE_HOST === 'localhost' || process.env.DATABASE_HOST === '127.0.0.1'
		? false
		: { rejectUnauthorized: false },
})

export const authOptions = {
	// Set any random key in .env.local
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			tenantId: process.env.AZURE_AD_TENANT_ID,
		}),
		GoogleProvider({
			// Follow the "Login with Google" tutorial to get your credentials
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			async profile(profile) {
				return {
					id: profile.sub,
					name: profile.given_name ? profile.given_name : profile.name,
					email: profile.email,
					image: profile.picture,
					createdAt: new Date(),
				}
			},
		}),
		// Follow the "Login with Email" tutorial to set up your email server
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: config.mailgun.fromNoReply,
		}),
	],
	adapter: PostgresAdapter(pool),
	callbacks: {
		//JWT callback runs when the token is created or updated
		jwt: async ({ token, user }) => {
			// user is only available on the first sign-in
			//console.log("JWT callback called. User:", user, "Token before:", token);
			const userId = user?.id || token.sub;
			if (userId && !token.permissions) {
				try {
					//console.log("Attempting to fetch permissions for ID:", userId);
					// Query your unified PostgreSQL database for permissions
					const { rows } = await pool.query(
						`SELECT 
							r.name as role_name, 
							p.name as permission_name
						 FROM user_roles ur
						 JOIN roles r ON ur.role_id = r.id
						 JOIN role_permissions rp ON r.id = rp.role_id
						 JOIN permissions p ON rp.permission_id = p.id
						 WHERE ur.user_id = $1`,
						[user.id]
					);

					// Extract unique role names
					token.roles = [...new Set(rows.map(row => row.role_name))];

					// Extract unique permission names
					token.permissions = [...new Set(rows.map(row => row.permission_name))];
                    //console.log("Permissions fetched for user:", token.permissions);
				} catch (error) {
					console.error("Error fetching user permissions:", error.message);
					token.permissions = [];
				}
			}
			return token;
		},
		//Session callback makes data available to the client/frontend
		session: async ({ session, token }) => {
            //console.log("Session callback called. Token:", token, "Session before:", session);
			if (session?.user) {
				session.user.id = token.sub

				// Transfer permissions/roles from the token to the session
				session.user.roles = token.roles || [];
				session.user.permissions = token.permissions || [];
			}
			return session
		},
	},
	session: {
		strategy: "jwt",
	},
	theme: {
		brandColor: config.colors.main,
		// Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
		// It will be used in the login flow to display your logo. If you don't add it, it will look faded.
		logo: "/logoAndName.png",
	},
	callbackUrl: `${config.domainName}${config.callbackUrl}`,
}

export default NextAuth(authOptions)
