import { RequestPasswordResetDTO, requestPasswordResetSchema } from "@auth/dtos/auth.schema";
import { RequestPasswordResetService } from "@auth/services/request-password-reset/request-password-reset.service";
import { Body, Controller, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { AuthFlowRequest } from "@shared/interfaces/authflow-request.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";

@Controller("auth")
@UseGuards(JwtAuthGuard)
export class RequestPasswordResetController implements AuthFlowController {
    constructor(private readonly requestPasswordResetService: RequestPasswordResetService) {}

    @Post("request-password-reset")
    async handle(
        @Body(new ZodValidationPipe(requestPasswordResetSchema)) dto: RequestPasswordResetDTO,
        @Req() req: AuthFlowRequest,
    ): Promise<BaseResponse<null>> {
        await this.requestPasswordResetService.execute(dto, req.user.email);
        return {
            data: null,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.password_reset.email_sent",
        };
    }
}
