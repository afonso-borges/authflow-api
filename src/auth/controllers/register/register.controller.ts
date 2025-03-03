import { RegisterDTO, AuthResponseDTO, registerSchema } from "@/auth/dtos/auth.schema";
import { LoginService } from "@/auth/services/login/login.service";
import { RegisterService } from "@/auth/services/register/register.service";
import { AuthFlowController } from "@/shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";
import { Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";

@Controller("auth")
export class RegisterController implements AuthFlowController {
    constructor(
        private readonly registerService: RegisterService,
        private readonly loginService: LoginService,
    ) {}

    @Post("register")
    @UsePipes(new ZodValidationPipe(registerSchema))
    async handle(@Body() registerDto: RegisterDTO): Promise<BaseResponse<AuthResponseDTO>> {
        await this.registerService.execute(registerDto);
        const authResponse = await this.loginService.execute({
            email: registerDto.email,
            password: registerDto.password,
        });

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.CREATED,
            message: "auth.register.success",
        };
    }
}
