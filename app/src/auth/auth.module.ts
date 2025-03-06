import { prismaInstance } from "@shared/repositories/prisma.repository";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import * as AuthControllers from "./controllers";
import * as AuthServices from "./services";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UtilsModule } from "@shared/utils/utils.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: "15m",
                },
            }),
            inject: [ConfigService],
        }),
        UtilsModule,
    ],
    controllers: [...Object.values(AuthControllers)],
    providers: [
        {
            provide: "PrismaRepository",
            useValue: prismaInstance,
        },
        ...Object.values(AuthServices),
        JwtStrategy,
    ],
    exports: [],
})
export class AuthModule {}
