import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { CreateRefreshTokenService } from "@auth/services/create-refresh-token/create-refresh-token.service";

describe("CreateRefreshTokenService", () => {
    let service: CreateRefreshTokenService;
    let prisma: PrismaRepository;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CreateRefreshTokenService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        refreshToken: {
                            create: jest.fn().mockResolvedValue({
                                token: "Generated token",
                                userId: "1",
                                expiresAt: new Date(),
                            }),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => "Generated token"),
                    },
                },
            ],
        }).compile();

        service = module.get<CreateRefreshTokenService>(CreateRefreshTokenService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
        jwtService = module.get<JwtService>(JwtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should call prisma.refreshToken.create with correct params", async () => {
        await service.execute("1");
        expect(prisma.refreshToken.create).toHaveBeenCalledWith({
            data: {
                token: "Generated token",
                expiresAt: expect.any(Date),
                userId: "1",
            },
        });
    });

    it("should call jwtService.sign with correct params", async () => {
        await service.execute("1");
        expect(jwtService.sign).toHaveBeenCalledWith({}, { expiresIn: "7d" });
    });
});
