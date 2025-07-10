/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
 import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import config from "@/config";

// Use this on all private routes (like user dashboard, accounts). It will redirect the user to the login page if not authenticated
export const usePrivate = (callbackUrl = config.callbackUrl) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl });
    }
  }, [status]);

  return [session, status];
};
