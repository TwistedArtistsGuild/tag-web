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
import RedditProvider from "next-auth/providers/reddit"
import InstagramProvider from "next-auth/providers/instagram"
import LinkedInProvider from "next-auth/providers/linkedin"
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
        RedditProvider({
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            authorization: {
                params: {
                    duration: 'permanent',
                },
            },
        }),
        InstagramProvider({
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            authorization: {
                params: { scope: 'openid profile email' },
            },
            issuer: 'https://www.linkedin.com',
            jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    createdAt: new Date(),
                }
            },
        }),
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: config.mailgun.fromNoReply,
		}),
	],
	adapter: PostgresAdapter(pool),
	callbacks: {
		//JWT callback runs when the token is created or updated
		jwt: async ({ token, user, account }) => {
			const userId = user?.id || token.sub;
			if (userId && !token.permissions) {
				try {
					const { rows } = await pool.query(
						`SELECT 
							r.name as role_name, 
							p.name as permission_name
						 FROM user_roles ur
						 JOIN roles r ON ur.role_id = r.id
						 JOIN role_permissions rp ON r.id = rp.role_id
						 JOIN permissions p ON rp.permission_id = p.id
						 WHERE ur.user_id = $1`,
						[userId]
					);

					token.roles = [...new Set(rows.map(row => row.role_name))];
					token.permissions = [...new Set(rows.map(row => row.permission_name))];
				} catch (error) {
					console.error("Error fetching user permissions:", error.message);
					token.permissions = [];
				}
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.sub
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
		logo: "/logoAndName.png",
	},
}

export default NextAuth(authOptions)
