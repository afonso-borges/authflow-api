import { RequestPasswordResetDTO, requestPasswordResetSchema } from "@auth/dtos/auth.schema";
import { RequestPasswordResetService } from "@auth/services/request-password-reset/request-password-reset.service";
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";

@Controller("auth")
export class RequestPasswordResetController implements AuthFlowController {
    constructor(private readonly requestPasswordResetService: RequestPasswordResetService) {}

    @Post("request-password-reset")
    async handle(
        @Body(new ZodValidationPipe(requestPasswordResetSchema)) dto: RequestPasswordResetDTO,
    ): Promise<BaseResponse<null>> {
        await this.requestPasswordResetService.execute(dto);
        return {
            data: null,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.password_reset.email_sent",
        };
    }
}
