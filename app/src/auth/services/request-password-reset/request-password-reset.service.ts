import { RequestPasswordResetDTO } from "@auth/dtos/auth.schema";
import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { MailService } from "@shared/utils/services/mail.service";
import { ValidateUrlService } from "@shared/utils/services/validate-url.service";

@Injectable()
export class RequestPasswordResetService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailService,
        private readonly validateUrlService: ValidateUrlService,
    ) {}

    async execute(dto: RequestPasswordResetDTO, userEmail: string): Promise<void> {
        const { email } = dto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException("auth.password_reset.user_not_found");
        }

        if (user.email !== userEmail) {
            throw new UnauthorizedException("auth.error.unauthorized");
        }

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

        const frontendUrl = await this.validateUrlService.execute(
            this.configService.get<string>("FRONTEND_URL") || "",
        );
        const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

        await this.mailerService.execute(user.email, "Password Reset Request", "reset_password", {
            name: user.name,
            resetUrl,
        });
    }
}
