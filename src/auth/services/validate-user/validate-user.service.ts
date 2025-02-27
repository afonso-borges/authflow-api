import { AuthUserDTO } from "@/auth/dtos/auth.schema";
import { Service } from "@/shared/interfaces/service.interface";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcrypt";

@Injectable()
export class ValidateUserService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository
    ) {}

    async execute(email: string, password: string): Promise<AuthUserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException("auth.error.invalid_credentials");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("auth.error.invalid_credentials");
        }

        if (user.status !== "ACTIVE") {
            throw new UnauthorizedException("auth.error.user_inactive");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
