import { Injectable } from "@nestjs/common";
import { Service } from "@/shared/interfaces/service.interface";
import { RevokeRefreshTokenService } from "../revoke-refresh-token/revoke-refresh-token.service";
import { ValidateRefreshTokenService } from "../validate-refresh-token/validate-refresh-token.service";
import { AuthUserDTO } from "@/auth/dtos/auth.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateRefreshTokenService } from "../create-refresh-token/create-refresh-token.service";

@Injectable()
export class RefreshTokenService implements Service {
    constructor(
        private readonly jwtService: JwtService,
        private readonly createRefreshTokenService: CreateRefreshTokenService,
        private readonly revokeRefreshTokenService: RevokeRefreshTokenService,
        private readonly validateRefreshTokenService: ValidateRefreshTokenService,
    ) {}

    async execute(
        token: string,
    ): Promise<{ access_token: string; refresh_token: string; user: AuthUserDTO }> {
        const refreshTokenData = await this.validateRefreshTokenService.execute(token);

        // Revoga o token atual após validação
        await this.revokeRefreshTokenService.execute(token);

        // Gera novo access token
        const accessToken = this.jwtService.sign({ sub: refreshTokenData.userId });

        // Gera novo refresh token
        const refreshToken = await this.createRefreshTokenService.execute(refreshTokenData.userId);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: refreshTokenData.user,
        };
    }
}
