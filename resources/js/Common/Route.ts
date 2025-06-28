export const route = (
    url: Route,
    propsParams: Record<string, string | number | undefined>,
): string => {
    let newUrl: string = url;
    Object.keys(propsParams).forEach((param) => {
        newUrl = newUrl.replace(`:${param}`, String(propsParams[param]));
    });

    return newUrl;
};

export enum Route {
    Dashboard = "/",
    AuthLogin = "/login",
    AuthLogout = "/logout",
    BarangKeluar = "/barang-keluar",
    StockBarang = "/barang-stock",

    // Kelola Barang Masuk
    BarangMasuk = "/barang-masuk",
    CreateBarangMasuk = "/barang-masuk/create",
    DeleteBarangMasuk = "/barang-masuk/delete/:uuid",

    // Kelola User
    KelolaUser = "/kelola-user",
    CreateUser = "/kelola-user/create",
    EditUser = "/kelola-user/edit/:uuid",
    DeleteUser = "/kelola-user/delete/:uuid",

    Order = "/orders",
    RootMaster = "/master",
    MasterSatuan = "/master/satuan",
    MasterKategori = "/master/kategori",
    MasterSupplier = "/master/supplier",
}
