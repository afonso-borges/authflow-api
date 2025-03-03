import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string({ invalid_type_error: "user.email.invalid_type_error" })
        .email({ message: "Invalid email" }),
    password: z.string({ invalid_type_error: "user.password.invalid_type_error" }),
});

export const registerSchema = loginSchema.extend({
    name: z
        .string({ invalid_type_error: "user.name.invalid_type_error" })
        .min(2, { message: "Name must be at least 2 characters long" }),
    password: z
        .string({ invalid_type_error: "user.password.invalid_type_error" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{6,}$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter and one number",
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
