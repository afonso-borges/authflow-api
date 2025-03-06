import { ResetPasswordDTO } from "@auth/dtos/auth.schema";
import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { hash } from "bcrypt";

@Injectable()
export class ResetPasswordService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async execute(dto: ResetPasswordDTO): Promise<void> {
        const { token, newPassword } = dto;

        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get("JWT_SECRET"),
            });

            if (payload.type !== "password_reset") {
                throw new BadRequestException("auth.error.invalid_token");
            }

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user) {
                throw new UnauthorizedException("auth.error.user_not_found");
            }

            const hashedPassword = await hash(newPassword, 10);

            await this.prisma.user.update({
                where: { id: payload.sub },
                data: { password: hashedPassword },
            });
        } catch (error) {
            if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
                throw new UnauthorizedException("auth.error.invalid_or_expired_token");
            }
            throw error;
        }
    }
}
