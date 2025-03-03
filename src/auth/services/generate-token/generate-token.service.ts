import { Service } from "@/shared/interfaces/service.interface";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateRefreshTokenService } from "../create-refresh-token/create-refresh-token.service";

@Injectable()
export class GenerateTokensService implements Service {
    constructor(
        private readonly jwtService: JwtService,
        private readonly createRefreshTokenService: CreateRefreshTokenService,
    ) {}

    async execute(userId: string) {
        const accessToken = this.jwtService.sign({ sub: userId });
        const refreshToken = await this.createRefreshTokenService.execute(userId);

        return { accessToken, refreshToken };
    }
}
