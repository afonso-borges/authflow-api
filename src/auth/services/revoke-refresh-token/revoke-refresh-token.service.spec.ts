import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { Test } from "@nestjs/testing";
import { RevokeRefreshTokenService } from "./revoke-refresh-token.service";

describe("RevokeRefreshTokenService", () => {
    let service: RevokeRefreshTokenService;
    let prisma: PrismaRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RevokeRefreshTokenService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        refreshToken: {
                            update: jest.fn(),
                            updateMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<RevokeRefreshTokenService>(RevokeRefreshTokenService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should call prisma.refreshToken.update with correct params", async () => {
        await service.execute("test-token");
        expect(prisma.refreshToken.update).toHaveBeenCalledWith({
            where: { token: "test-token" },
            data: { isRevoked: true },
        });
    });

    it("should call prisma.refreshToken.updateMany with correct params", async () => {
        await service.revokeAllUserTokens("test-user");
        expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
            where: { userId: "test-user" },
            data: { isRevoked: true },
        });
    });
});
