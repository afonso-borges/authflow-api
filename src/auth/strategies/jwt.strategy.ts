import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";

interface JwtPayload {
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {
        const jwtSecret = configService.get<string>("JWT_SECRET");

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || user.status !== "ACTIVE") {
            throw new UnauthorizedException("auth.error.user_inactive");
        }

        return { userId: payload.sub };
    }
}
