export type Paginate<T> = {
    data: T[];
    current_page: number;
    total: number;
    per_page: number;
};

export type TUser = {
    uuid: string;
    name: string;
    email: string;
    noWhatsapp: string;
    password?: string;
    roles: TRoles[];
};

export type TSatuan = {
    uuid: string;
    name: string;
    code: string;
    description: string;
};

export type TStock = {
    barang: TBarang;
    name: string;
    quantity: number;
    potensi_penjualan: number;
    itr: number;
    rop: number;
    status_rop: string;
    status_itr: string;
};

export type TBarang = {
    uuid: string;
    name: string;
    supplier: TSupplier;
    satuan: TSatuan;
    hargaJual: number;
    hargaBeli: number;
    maximal_quantity: number;
    rata_rata_permintaan_harian: number;
    leadtime: number;
    safety_stock: number;
};

export type TSupplier = {
    uuid: string;
    name: string;
    contactPerson: string;
    noWhatsapp: string;
    email: string;
    alamat: string;
    kota: string;
};

export type TBarangMasukItem = {
    barang_masuk_id: number;
    barang_id: number;
    barangs: TBarang;
    quantity: number;
    harga_beli: number;
};

export type TBarangMasuk = {
    uuid: string;
    nomor_referensi: string;
    tanggal_masuk: string;
    supplier: string;
    catatan: string | null;
    items: TBarangMasukItem[];
};

export type TBarangKeluarItem = {
    barang_keluar_id: number;
    barang_id: number;
    barangs: TBarang;
    quantity: number;
    harga_jual: number;
};

export type TBarangKeluar = {
    uuid: string;
    nomor_referensi: string;
    tanggal_keluar: string;
    catatan: string | null;
    user: TUser;
    verifikasi_kepala_toko: boolean;
    verifikasi_kepala_gudang: boolean;
    kepala_toko_menolak: boolean;
    kepala_gudang_menolak: boolean;
    status: string;
    catatan_penolakan: string;
    items: TBarangKeluarItem[];
};

export type TPurchaseOrder = {
    uuid: string;
    nomor_referensi: string;
    tanggal_order: string;
    catatan: string | null;
    supplier_id: number;
    supplier: TSupplier;
    verifikasi_kepala_toko: boolean;
    verifikasi_kepala_gudang: boolean;
    verifikasi_kepala_pengadaan: boolean;
    verifikasi_kepala_accounting: boolean;
    status: string;
    items: TPurchaseOrderItem[];
};

export type TPurchaseOrderItem = {
    purchase_order_id: number;
    barang_id: number;
    barang: TBarang;
    quantity: number;
    harga_beli: number;
};

export type TLaporanDeadstock = {
    uuid: string;
    nomor_referensi: string;
    periode_mulai: string;
    periode_akhir: string;
    items: TITRItem[];
};

export type TITRItem = {
    purchase_order_id: number;
    barang_id: number;
    barang: TBarang;
    quantity: number;
    harga_beli: number;
};

type TRoles = {
    id: number;
    name: string;
};

export interface IUser {
    name: string;
    id: number;
    email: string;
    roles: string[];
    permissions: string[];
}
