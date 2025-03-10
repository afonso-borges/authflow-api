import { refreshTokenSchema, RefreshTokenDTO } from "@auth/dtos/auth.schema";
import { LogoutService } from "@auth/services/logout/logout.service";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";
import { Controller, Post, UsePipes, Body, HttpStatus } from "@nestjs/common";

@Controller("auth")
export class LogoutController implements AuthFlowController {
    constructor(private readonly logoutService: LogoutService) {}

    @Post("logout")
    @UsePipes(new ZodValidationPipe(refreshTokenSchema))
    async handle(
        @Body() { refresh_token }: RefreshTokenDTO,
    ): Promise<BaseResponse<null>> {
        await this.logoutService.execute(refresh_token);

        return {
            data: null,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.logout.success",
        };
    }
}
