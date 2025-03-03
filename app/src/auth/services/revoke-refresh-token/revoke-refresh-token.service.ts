import { Inject, Injectable } from "@nestjs/common";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Service } from "@shared/interfaces/service.interface";

@Injectable()
export class RevokeRefreshTokenService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(token: string) {
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
}
