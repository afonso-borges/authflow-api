import { Inject, Injectable } from "@nestjs/common";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Service } from "@shared/interfaces/service.interface";
import { RevokeRefreshTokenService } from "@auth/services/revoke-refresh-token/revoke-refresh-token.service";

@Injectable()
export class LogoutService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly revokeRefreshTokenService: RevokeRefreshTokenService,
    ) {}

    async execute(refreshToken: string): Promise<void> {
        await this.revokeRefreshTokenService.execute(refreshToken);
    }
}
