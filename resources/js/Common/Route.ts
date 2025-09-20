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
    StockBarang = "/barang-stock",

    // Kelola Permintaan Barang Keluar
    PermintaanBarangKeluar = "/permintaan-barang-keluar",
    PermintaanBarangKeluarDetail = "/permintaan-barang-keluar/:uuid",
    CreatePermintaanBarangKeluar = "/permintaan-barang-keluar/create",
    EditPermintaanBarangKeluar = "/permintaan-barang-keluar/edit/:uuid",
    DeletePermintaanBarangKeluar = "/permintaan-barang-keluar/delete/:uuid",
    VerifikasiPermintaanKeluar = "/permintaan-barang-keluar/:uuid/approved",

    // Kelola Barang Keluar
    BarangKeluar = "/barang-keluar",
    EksekusiBarangKeluar = "/barang-keluar/:uuid/execute",
    CekEksekusiBarangKeluar = "/barang-keluar/:uuid/check-execute",

    // Kelola Barang Masuk
    BarangMasuk = "/barang-masuk",
    BarangMasukDetail = "/barang-masuk/:uuid",
    CreateBarangMasuk = "/barang-masuk/create",
    EditBarangMasuk = "/barang-masuk/edit/:uuid",
    DeleteBarangMasuk = "/barang-masuk/delete/:uuid",

    // Kelola User
    KelolaUser = "/kelola-user",
    CreateUser = "/kelola-user/create",
    EditUser = "/kelola-user/edit/:uuid",
    DeleteUser = "/kelola-user/delete/:uuid",

    // Master Satuan
    MasterSatuan = "/master/satuan",
    CreateMasterSatuan = "/master/satuan/create",
    EditMasterSatuan = "/master/satuan/edit/:uuid",
    DeleteMasterSatuan = "/master/satuan/delete/:uuid",

    // Master Supplier
    MasterSupplier = "/master/supplier",
    CreateMasterSupplier = "/master/supplier/create",
    EditMasterSupplier = "/master/supplier/edit/:uuid",
    DeleteMasterSupplier = "/master/supplier/delete/:uuid",

    // Master Barang
    MasterBarang = "/master/barang",
    CreateMasterBarang = "/master/barang/create",
    EditMasterBarang = "/master/barang/edit/:uuid",
    DeleteMasterBarang = "/master/barang/delete/:uuid",

    // Kelola Purchase Order
    PurchaseOrder = "/purchase-orders",
    PurchaseOrderDetail = "/purchase-orders/:uuid",
    CreatePurchaseOrder = "/purchase-orders/create",
    EditPurchaseOrder = "/purchase-orders/edit/:uuid",
    DeletePurchaseOrder = "/purchase-orders/delete/:uuid",

    LaporanDeadstock = "/laporan-deadstock",
    RootMaster = "/master",
    MasterKategori = "/master/kategori",
}
