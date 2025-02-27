import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { LoginDTO, RegisterDTO, AuthUserDTO, AuthResponseDTO } from "@auth/dtos/auth.schema";
import { RefreshTokenService } from "@auth/services/refresh-token.service";

@Injectable()
export class AuthService {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async validateUser(email: string, password: string): Promise<AuthUserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException("auth.error.invalid_credentials");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("auth.error.invalid_credentials");
        }

        if (user.status !== "ACTIVE") {
            throw new UnauthorizedException("auth.error.user_inactive");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(loginDto: LoginDTO): Promise<AuthResponseDTO> {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const tokens = await this.generateTokens(user.id);

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user,
        };
    }

    async register(registerDto: RegisterDTO): Promise<AuthUserDTO> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new UnauthorizedException("auth.error.email_already_registered");
        }

        const hashedPassword = await hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
                status: "ACTIVE",
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    private async generateTokens(userId: string) {
        const accessToken = this.jwtService.sign({ sub: userId });
        const refreshToken = await this.refreshTokenService.createRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        const refreshTokenData = await this.refreshTokenService.validateRefreshToken(token);

        // Revoga o token atual após validação
        await this.refreshTokenService.revokeRefreshToken(token);

        // Gera novos tokens
        const tokens = await this.generateTokens(refreshTokenData.userId);

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user: refreshTokenData.user,
        };
    }

    async getMe(token: string | undefined): Promise<AuthUserDTO | null> {
        if (!token) {
            throw new UnauthorizedException("auth.error.no_token_provided");
        }
        const [, tokenHash] = token.split(" ");

        try {
            const { sub } = this.jwtService.verify(tokenHash);
            const user = await this.prisma.user.findUnique({
                where: { id: sub },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return user;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new UnauthorizedException("auth.error.invalid_token");
        }
    }
}
