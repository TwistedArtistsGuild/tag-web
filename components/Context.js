/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { createContext, useState, useContext } from "react";
import { useSession } from "next-auth/react";

// Create a Context object to store app-wide state
const AppContext = createContext();

/**
 * AppWrapper - Context provider for application-wide state
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render
 * @returns {JSX.Element} Context provider element
 */
export function AppWrapper({ children }) {
    // Active navigation item tracker
    const [active, setActive] = useState("");
    
    // Authentication state from NextAuth
    const { data: session } = useSession();
    
    // Page sections for table of contents
    const [pageSections, setPageSections] = useState([]);
    
    // Share values across the app
    const sharedState = {
        // Active navigation item
        active,
        setActive,
        
        // User data from session
        user: session?.user ?? null,
        
        // Page sections for table of contents
        pageSections,
        setPageSections,
    };

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to use the app context
export function useAppContext() {
    return useContext(AppContext);
}
