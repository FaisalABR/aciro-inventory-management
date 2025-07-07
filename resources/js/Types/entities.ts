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

export type TBarang = {
    uuid: string;
    name: string;
    supplier: TSupplier;
    satuan: TSatuan;
    hargaJual: number;
    hargaBeli: number;
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
    items: TBarangKeluarItem[];
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
