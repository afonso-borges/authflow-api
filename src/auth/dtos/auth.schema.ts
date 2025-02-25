import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string({ invalid_type_error: "user.email.invalid_type_error" })
        .email({ message: "Email inválido" }),
    password: z
        .string({ invalid_type_error: "user.password.invalid_type_error" })
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

export const registerSchema = loginSchema.extend({
    name: z
        .string({ invalid_type_error: "user.name.invalid_type_error" })
        .min(2, { message: "O nome deve ter no mínimo 2 caracteres" }),
    password: z
        .string({ invalid_type_error: "user.password.invalid_type_error" })
        .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
            message:
                "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
        }),
});

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const authResponseSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: userSchema,
});

export const refreshTokenSchema = z.object({
    refresh_token: z.string({
        required_error: "auth.refresh_token.required",
        invalid_type_error: "auth.refresh_token.invalid_type",
    }),
});

// DTOs gerados a partir dos schemas
export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type AuthUserDTO = z.infer<typeof userSchema>;
export type AuthResponseDTO = z.infer<typeof authResponseSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
