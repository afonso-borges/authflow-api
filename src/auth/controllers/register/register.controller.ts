import { RegisterDTO, AuthResponseDTO, registerSchema } from "@/auth/dtos/auth.schema";
import { AuthService } from "@/auth/services/auth.service";
import { AuthFlowController } from "@/shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";
import { Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";

@Controller("auth")
export class RegisterController implements AuthFlowController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @UsePipes(new ZodValidationPipe(registerSchema))
    async handle(@Body() registerDto: RegisterDTO): Promise<BaseResponse<AuthResponseDTO>> {
        const user = await this.authService.register(registerDto);
        const authResponse = await this.authService.login({
            email: user.email,
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
