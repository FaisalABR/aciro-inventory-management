export const generateRolesName = (role: string) => {
    return role
        .split("_")
        .map((item) => item.toUpperCase())
        .join(" ");
};
