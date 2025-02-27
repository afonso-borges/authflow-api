import { refreshTokenSchema, RefreshTokenDTO, AuthResponseDTO } from "@/auth/dtos/auth.schema";
import { RefreshTokenService } from "@/auth/services/refresh-token/refresh-token.service";
import { AuthFlowController } from "@/shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";
import { Controller, Post, UsePipes, Body, HttpStatus } from "@nestjs/common";

@Controller("auth")
export class RefreshTokenController implements AuthFlowController {
    constructor(private readonly refreshTokenService: RefreshTokenService) {}

    @Post("refresh")
    @UsePipes(new ZodValidationPipe(refreshTokenSchema))
    async handle(
        @Body() { refresh_token }: RefreshTokenDTO,
    ): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.refreshTokenService.execute(refresh_token);

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.token.refreshed",
        };
    }
}
