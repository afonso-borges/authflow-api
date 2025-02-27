import { RegisterDTO, AuthUserDTO } from "@/auth/dtos/auth.schema";
import { Service } from "@/shared/interfaces/service.interface";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash } from "bcrypt";
import { RefreshTokenService } from "../refresh-token.service";

@Injectable()
export class RegisterService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async execute(registerDto: RegisterDTO): Promise<AuthUserDTO> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new UnauthorizedException("auth.error.email_already_registered");
        }

        const hashedPassword = await hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
                status: "ACTIVE",
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
