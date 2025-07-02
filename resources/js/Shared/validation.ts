import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z
        .string({
            required_error: "email wajib diisi",
        })
        .email("Format email tidak valid")
        .min(3, { message: "Email minimal 3 karakter" })
        .max(255, { message: "Email maximal dari 255 karakter" }),
    name: z
        .string({
            required_error: "Nama harus diisi",
        })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(255, { message: "Nama maximal dari 255 karakter" }),
    password: z
        .string({
            required_error: "Password harus diisi",
        })
        .min(8, { message: "Password minimal 8 karakter" }),
    noWhatsapp: z
        .string({
            required_error: "No Whatsapp harus diisi",
        })
        .min(10, { message: "No Whatsapp minimal 10 karakter" })
        .max(13, { message: "No Whatsapp maksimal 13 karakter" }),
    roles: z.number({ required_error: "Role harus diisi" }),
});

export const EditUserSchema = CreateUserSchema.omit({ password: true });

export const CreateSatuanSchema = z.object({
    name: z
        .string({
            required_error: "Nama harus diisi",
        })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(20, { message: "Nama maximal dari 20 karakter" }),
    code: z
        .string({
            required_error: "Kode harus diisi",
        })
        .min(3, { message: "Kode minimal 3 karakter" })
        .max(20, { message: "Kode maximal dari 20 karakter" }),
    description: z
        .string({
            required_error: "Deskripsi harus diisi",
        })
        .min(3, { message: "Deskripsi minimal 3 karakter" })
        .max(255, { message: "Deskripsi maximal dari 255 karakter" }),
});

export const CreateSupplierSchema = z.object({
    name: z
        .string({
            required_error: "Nama harus diisi",
        })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(20, { message: "Nama maximal dari 20 karakter" }),
    contactPerson: z
        .string({
            required_error: "Contact Person harus diisi",
        })
        .min(3, { message: "Contact Person minimal 3 karakter" })
        .max(20, { message: "Contact Person maximal dari 20 karakter" }),
    noWhatsapp: z
        .string({
            required_error: "No Whatsapp harus diisi",
        })
        .min(10, { message: "No Whatsapp minimal 10 karakter" })
        .max(13, { message: "No Whatsapp maksimal 13 karakter" }),
    email: z
        .string({
            required_error: "email wajib diisi",
        })
        .email("Format email tidak valid")
        .min(3, { message: "Email minimal 3 karakter" })
        .max(255, { message: "Email maximal dari 255 karakter" }),
    kota: z
        .string({
            required_error: "Nama harus diisi",
        })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(20, { message: "Nama maximal dari 20 karakter" }),
    alamat: z
        .string({
            required_error: "Deskripsi harus diisi",
        })
        .min(3, { message: "Deskripsi minimal 3 karakter" })
        .max(255, { message: "Deskripsi maximal dari 255 karakter" }),
});

export const CreateBarangSchema = z.object({
    name: z
        .string({
            required_error: "Nama harus diisi",
        })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(20, { message: "Nama maximal dari 20 karakter" }),
    supplier: z.number({ required_error: "Supplier harus diisi" }),
    satuan: z.number({ required_error: "Satuan harus diisi" }),
    hargaJual: z
        .number({
            required_error: "Harga Jual wajib diisi",
        })
        .min(0, { message: "Harga Jual tidak boleh 0" }),
    hargaBeli: z
        .number({
            required_error: "Harga Beli wajib diisi",
        })
        .min(0, { message: "Harga Beli tidak boleh 0" }),
});
