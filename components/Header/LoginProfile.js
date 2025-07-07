/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { signIn, signOut, useSession } from "next-auth/react"
import config from "@/config"

const LoginProfile = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const { data: session } = useSession()
	const router = useRouter()

	let timer;

	const handleProfileClick = () => {
		setMenuOpen(!menuOpen)
	}

	const handleMouseEnter = () => {
		if (!menuOpen) {
			setMenuOpen(true);
		}
		if (timer) {
			clearTimeout(timer);
		}
	};

	const handleMouseLeave = () => {
		timer = setTimeout(() => {
			setMenuOpen(false);
		}, 500);
	};

	const handleMenuClick = (path) => {
		setMenuOpen(false)
		router.push(path)
	}

	if (!session) {
		return (
			<div className="relative inline-block">
				<div
					className="avatar placeholder w-12 h-12 rounded-full bg-primary text-primary-content flex justify-center items-center cursor-pointer"
					onClick={() => signIn(undefined, { callbackUrl: config.callbackUrl })}
				>
					<span>Login</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative inline-block">
			<div
				className="avatar w-12 h-12 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
				onClick={handleProfileClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<img
					src={session?.user?.image || "/taglogo.png"}
					alt="Profile"
					className="w-full h-full object-cover"
				/>
			</div>
			{menuOpen && (
				<div
					className="absolute top-14 right-0 bg-base-100 border border-base-300 shadow-md rounded-md overflow-hidden z-50"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div
						className="px-5 py-2 cursor-pointer hover:bg-base-200"
						onClick={() => handleMenuClick("/user/profile")}
					>
						Profile
					</div>
					<div
						className="px-5 py-2 cursor-pointer hover:bg-base-200"
						onClick={() => handleMenuClick("/user/settings")}
					>
						Settings
					</div>
					<div
						className="px-5 py-2 cursor-pointer hover:bg-base-200"
						onClick={() => handleMenuClick("/user/preferences")}
					>
						Preferences
					</div>
					<div
						className="px-5 py-2 cursor-pointer hover:bg-base-200"
						onClick={() => signOut({ callbackUrl: "/" })}
					>
						Logout
					</div>
				</div>
			)}
		</div>
	)
}

export default LoginProfile
