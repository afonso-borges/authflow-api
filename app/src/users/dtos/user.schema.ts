import { z } from "zod";

export const userStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const createUserSchema = z.object({
    email: z
        .string({ invalid_type_error: "user.email.invalid_type_error" })
        .email({ message: "Invalid email" }),
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
    status: userStatusEnum.optional(),
});

export const updateUserSchema = z.object({
    name: z
        .string({ invalid_type_error: "user.name.invalid_type_error" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .optional(),
    status: userStatusEnum.optional(),
    password: z
        .string({ invalid_type_error: "user.password.invalid_type_error" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{6,}$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter and one number",
        })
        .optional(),
});

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    status: userStatusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const userPaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    status: userStatusEnum.optional(),
    search: z.string().optional(),
});

// DTOs generated from schemas
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserDTO = z.infer<typeof userSchema>;
export type UserPaginationDTO = z.infer<typeof userPaginationSchema>;
