import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";

@Injectable()
export class RefreshTokenService {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
    ) {}

    async createRefreshToken(userId: string, deviceInfo?: string, ipAddress?: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de expiração

        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                token: this.generateRefreshToken(),
                userId,
                expiresAt,
                deviceInfo,
                ipAddress,
            },
        });

        return refreshToken.token;
    }

    async validateRefreshToken(token: string) {
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

    async revokeRefreshToken(token: string) {
        await this.prisma.refreshToken.update({
            where: { token },
            data: { isRevoked: true },
        });
    }

    async revokeAllUserTokens(userId: string) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true },
        });
    }

    private generateRefreshToken(): string {
        return this.jwtService.sign({}, { expiresIn: "7d" });
    }
}
