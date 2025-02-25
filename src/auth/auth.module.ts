import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { prismaInstance } from "@/shared/repositories/prisma.repository";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: "15m",
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: "PrismaRepository",
            useValue: prismaInstance,
        },
        AuthService,
        RefreshTokenService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
