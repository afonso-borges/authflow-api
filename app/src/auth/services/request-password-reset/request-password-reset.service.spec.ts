import { RequestPasswordResetDTO } from "@auth/dtos/auth.schema";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { MailService } from "@shared/utils/services/mail.service";
import { RequestPasswordResetService } from "./request-password-reset.service";

describe("RequestPasswordResetService", () => {
    let service: RequestPasswordResetService;
    let prisma: PrismaRepository;
    let jwtService: JwtService;
    let configService: ConfigService;
    let mailService: MailService;

    const requestPasswordResetData: RequestPasswordResetDTO = {
        email: "test@mail.com",
    };

    const mockUser = {
        id: "user-id-1",
        email: "test@mail.com",
        name: "Test User",
        password: "hashed_password",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockToken = "mock-jwt-token";
    const mockFrontendUrl = "http://localhost:3000";
    const mockJwtSecret = "test-secret";

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RequestPasswordResetService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUniqueOrThrow: jest.fn().mockResolvedValue(mockUser),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue(mockToken),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key) => {
                            if (key === "FRONTEND_URL") return mockFrontendUrl;
                            if (key === "JWT_SECRET") return mockJwtSecret;
                            return null;
                        }),
                    },
                },
                {
                    provide: MailService,
                    useValue: {
                        execute: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        service = module.get<RequestPasswordResetService>(RequestPasswordResetService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        mailService = module.get<MailService>(MailService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(configService).toBeDefined();
        expect(mailService).toBeDefined();
    });

    it("should find user by email", async () => {
        await service.execute(requestPasswordResetData);
        expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
            where: { email: requestPasswordResetData.email },
        });
    });

    it("should generate a JWT token with correct payload", async () => {
        await service.execute(requestPasswordResetData);
        expect(jwtService.sign).toHaveBeenCalledWith(
            {
                sub: mockUser.id,
                email: mockUser.email,
                type: "password_reset",
            },
            {
                expiresIn: "24h",
                secret: mockJwtSecret,
            },
        );
    });

    it("should get frontend URL from config", async () => {
        await service.execute(requestPasswordResetData);
        expect(configService.get).toHaveBeenCalledWith("FRONTEND_URL");
    });

    it("should send email with reset URL", async () => {
        await service.execute(requestPasswordResetData);
        const resetUrl = `${mockFrontendUrl}/reset-password?token=${mockToken}`;
        expect(mailService.execute).toHaveBeenCalledWith(
            mockUser.email,
            "Password Reset Request",
            "reset_password",
            {
                resetUrl,
            },
        );
    });
});
