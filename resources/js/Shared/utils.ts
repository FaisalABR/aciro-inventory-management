export const generateRolesName = (role: string) => {
    return role
        .split("_")
        .map((item) => item.toUpperCase())
        .join(" ");
};

export const formatRupiah = (value: number | undefined) => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};

export const parser = (value: string | undefined) => {
    if (!value) return 0;

    let cleanedValue = value.replace(/[^0-9,-]/g, "");
    cleanedValue = cleanedValue.replace(/,/, ".");

    const parsed = parseFloat(cleanedValue);

    return isNaN(parsed) ? 0 : parsed;
};

export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift() ?? null;
    }
    return null;
}
