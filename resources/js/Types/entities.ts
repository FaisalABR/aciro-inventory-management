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
