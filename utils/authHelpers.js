export const hasPermission = (session, permissionName) => {
    //console.log("Checking permission:", session?.user?.permissions);
   // console.log("Required permission:", permissionName);
    return !!session?.user?.permissions?.includes(permissionName);
};

export const isAdmin = (session) => {
    return !!session?.user?.roles?.includes("admin");
};

export const isStaff = (session) => {
    return !!session?.user?.roles?.includes("staff");
};

export const isArtist = (session) => {
    return !!session?.user?.roles?.includes("artist");
};