import { RequestPasswordResetDTO } from "@auth/dtos/auth.schema";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { MailService } from "@shared/utils/services/mail.service";

@Injectable()
export class RequestPasswordResetService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailService,
    ) {}

    async execute(dto: RequestPasswordResetDTO): Promise<void> {
        const { email } = dto;

        const user = await this.prisma.user.findUniqueOrThrow({
            where: { email },
        });

        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
                type: "password_reset",
            },
            {
                expiresIn: "24h",
                secret: this.configService.get("JWT_SECRET"),
            },
        );

        const frontendUrl = this.configService.get<string>("FRONTEND_URL");
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

        await this.mailerService.execute(user.email, "Password Reset Request", "reset_password", {
            resetUrl,
        });
    }
}
