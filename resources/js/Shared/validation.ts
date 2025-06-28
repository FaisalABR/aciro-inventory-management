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
