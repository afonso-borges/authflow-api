import { Service } from "@/shared/interfaces/service.interface";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { Injectable, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CreateRefreshTokenService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(userId: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de expiração

        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                token: this.generateRefreshToken(),
                userId,
                expiresAt,
            },
        });

        return refreshToken.token;
    }

    private generateRefreshToken(): string {
        return this.jwtService.sign({}, { expiresIn: "7d" });
    }
}
