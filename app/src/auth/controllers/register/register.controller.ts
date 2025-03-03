import { RegisterDTO, AuthResponseDTO } from "@auth/dtos/auth.schema";
import { RegisterService, LoginService } from "@auth/services";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";
import { Controller, Post, UsePipes, Body, HttpStatus } from "@nestjs/common";
import { registerSchema } from "@auth/dtos/auth.schema";

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
