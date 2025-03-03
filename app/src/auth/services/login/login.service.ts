import { LoginDTO, AuthResponseDTO } from "@auth/dtos/auth.schema";
import { Injectable } from "@nestjs/common";
import { Service } from "@shared/interfaces/service.interface";
import { GenerateTokensService } from "../generate-token/generate-token.service";
import { ValidateUserService } from "../validate-user/validate-user.service";

@Injectable()
export class LoginService implements Service {
    constructor(
        private readonly generateTokens: GenerateTokensService,
        private readonly validateUser: ValidateUserService,
    ) {}

    async execute(loginDto: LoginDTO): Promise<AuthResponseDTO> {
        const user = await this.validateUser.execute(loginDto.email, loginDto.password);
        const tokens = await this.generateTokens.execute(user.id);

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user,
        };
    }
}
