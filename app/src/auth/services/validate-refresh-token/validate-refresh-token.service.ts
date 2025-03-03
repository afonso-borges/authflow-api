import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Service } from "@shared/interfaces/service.interface";

@Injectable()
export class ValidateRefreshTokenService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(token: string) {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!refreshToken || refreshToken.isRevoked) {
            throw new UnauthorizedException("auth.error.invalid_refresh_token");
        }

        if (new Date() > refreshToken.expiresAt) {
            throw new UnauthorizedException("auth.error.refresh_token_expired");
        }

        if (refreshToken.user.status !== "ACTIVE") {
            throw new UnauthorizedException("auth.error.user_inactive");
        }

        // Atualiza lastUsedAt
        await this.prisma.refreshToken.update({
            where: { id: refreshToken.id },
            data: { lastUsedAt: new Date() },
        });

        return refreshToken;
    }
}
