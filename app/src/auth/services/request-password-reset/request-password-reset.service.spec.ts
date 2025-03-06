import { RequestPasswordResetDTO } from "@auth/dtos/auth.schema";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
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

    const mockUser: User = {
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
                            findUnique: jest.fn().mockResolvedValue(mockUser),
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
        await service.execute(requestPasswordResetData, mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: requestPasswordResetData.email },
        });
    });

    it("should throw BadRequestException if user not found", async () => {
        jest.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(null);

        await expect(service.execute(requestPasswordResetData, mockUser)).rejects.toThrow(
            new BadRequestException("auth.password_reset.user_not_found"),
        );
    });

    it("should throw UnauthorizedException if requesting user is different from authenticated user", async () => {
        const differentUser = { ...mockUser, id: "different-user-id" };

        await expect(service.execute(requestPasswordResetData, differentUser)).rejects.toThrow(
            new UnauthorizedException("auth.error.unauthorized"),
        );
    });

    it("should generate a JWT token with correct payload", async () => {
        await service.execute(requestPasswordResetData, mockUser);
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
        await service.execute(requestPasswordResetData, mockUser);
        expect(configService.get).toHaveBeenCalledWith("FRONTEND_URL");
    });

    it("should send email with reset URL", async () => {
        await service.execute(requestPasswordResetData, mockUser);
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
