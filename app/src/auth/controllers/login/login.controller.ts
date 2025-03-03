import { loginSchema, LoginDTO, AuthResponseDTO } from "@auth/dtos/auth.schema";
import { LoginService } from "@auth/services/login/login.service";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";
import { Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";

@Controller("auth")
export class LoginController implements AuthFlowController {
    constructor(private readonly loginService: LoginService) {}

    @Post("login")
    @UsePipes(new ZodValidationPipe(loginSchema))
    async handle(@Body() loginDto: LoginDTO): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.loginService.execute(loginDto);

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.login.success",
        };
    }
}
