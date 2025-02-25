import {
    Controller,
    Post,
    Body,
    Headers,
    Ip,
    HttpCode,
    HttpStatus,
    UsePipes,
} from "@nestjs/common";
import { AuthService } from "@/auth/services/auth.service";
import {
    loginSchema,
    registerSchema,
    refreshTokenSchema,
    LoginDTO,
    RegisterDTO,
    RefreshTokenDTO,
    AuthResponseDTO,
} from "@/auth/dtos/auth.schema";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @UsePipes(new ZodValidationPipe(registerSchema))
    async register(@Body() registerDto: RegisterDTO): Promise<BaseResponse<AuthResponseDTO>> {
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

    @Post("login")
    @UsePipes(new ZodValidationPipe(loginSchema))
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDTO,
        @Headers("user-agent") userAgent?: string,
        @Ip() ip?: string,
    ): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.authService.login(loginDto, userAgent, ip);

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.login.success",
        };
    }

    @Post("refresh")
    @UsePipes(new ZodValidationPipe(refreshTokenSchema))
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Body() { refresh_token }: RefreshTokenDTO,
        @Headers("user-agent") userAgent?: string,
        @Ip() ip?: string,
    ): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.authService.refreshToken(refresh_token, userAgent, ip);

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.token.refreshed",
        };
    }
}
