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

export type TKategori = {
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
    satuan_id: number;
    kategori_id: number;
    supplier_id: number;
    supplier: TSupplier;
    satuan: TSatuan;
    kategori: TKategori;
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
    verifikasi_kepala_toko: boolean;
    verifikasi_kepala_gudang: boolean;
    status: string;
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
    id: string;
    uuid: string;
    nomor_referensi: string;
    tanggal_order: string;
    tanggal_sampai: string;
    catatan: string | null;
    supplier_id: number;
    supplier: TSupplier;
    verifikasi_kepala_toko: boolean;
    verifikasi_kepala_gudang: boolean;
    verifikasi_kepala_pengadaan: boolean;
    verifikasi_kepala_accounting: boolean;
    kepala_toko_menolak: boolean;
    kepala_gudang_menolak: boolean;
    kepala_accounting_menolak: boolean;
    kepala_pengadaan_menolak: boolean;
    catatan_penolakan: string;
    catatan_penolakan_supplier: string;
    total_pembelian: number;
    status: string;
    items: TPurchaseOrderItem[];
    pembayaran: any;
    dokumen_pengiriman: string;
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
    created_at: string;
    items: TITRItem[];
    related_expired: any;
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
