import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Test } from "@nestjs/testing";
import { ValidateRefreshTokenService } from "./validate-refresh-token.service";

describe("ValidateRefreshTokenService", () => {
    let service: ValidateRefreshTokenService;
    let prisma: PrismaRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ValidateRefreshTokenService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        refreshToken: {
                            findUnique: jest.fn().mockResolvedValue({
                                id: 1,
                                token: "test-token",
                                isRevoked: false,
                                expiresAt: new Date(Date.now() + 3600000),
                                lastUsedAt: new Date(),
                                user: {
                                    id: 1,
                                    status: "ACTIVE",
                                },
                            }),
                            update: jest.fn().mockResolvedValue({}),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ValidateRefreshTokenService>(ValidateRefreshTokenService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should call prisma.refreshToken.findUnique with correct params", async () => {
        await service.execute("test-token");
        expect(prisma.refreshToken.findUnique).toHaveBeenCalledWith({
            where: { token: "test-token" },
            include: { user: true },
        });
    });
});
