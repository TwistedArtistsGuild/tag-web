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
	ssl: {
		rejectUnauthorized: false,
	},
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
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.sub
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
