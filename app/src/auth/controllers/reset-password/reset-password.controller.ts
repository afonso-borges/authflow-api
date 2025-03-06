import { resetPasswordSchema, ResetPasswordDTO } from "@auth/dtos/auth.schema";
import { ResetPasswordService } from "@auth/services/reset-password/reset-password.service";
import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";

@Controller("auth")
export class ResetPasswordController implements AuthFlowController {
    constructor(private readonly resetPasswordService: ResetPasswordService) {}

    @Post("reset-password")
    async handle(
        @Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDTO,
    ): Promise<BaseResponse<null>> {
        await this.resetPasswordService.execute(dto);

        return {
            data: null,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.password_reset.success",
        };
    }
}
