import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Get, Req } from "@nestjs/common";
import { AuthService } from "@/auth/services/auth.service";
import {
    loginSchema,
    registerSchema,
    refreshTokenSchema,
    LoginDTO,
    RegisterDTO,
    RefreshTokenDTO,
    AuthResponseDTO,
    AuthUserDTO,
    userSchema,
} from "@/auth/dtos/auth.schema";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";
import { FastifyRequest } from "fastify";

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
    async login(@Body() loginDto: LoginDTO): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.authService.login(loginDto);

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
    ): Promise<BaseResponse<AuthResponseDTO>> {
        const authResponse = await this.authService.refreshToken(refresh_token);

        return {
            data: authResponse,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.token.refreshed",
        };
    }

    @Get("me")
    @UsePipes(new ZodValidationPipe(userSchema))
    async getMe(@Req() req: FastifyRequest): Promise<BaseResponse<AuthUserDTO>> {
        return {
            data: await this.authService.getMe(req.headers.authorization),
            meta: null,
            status: HttpStatus.OK,
            message: "auth.me.success",
        };
    }
}
