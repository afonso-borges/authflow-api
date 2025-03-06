import { ResetPasswordDTO } from "@auth/dtos/auth.schema";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { ResetPasswordService } from "./reset-password.service";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("ResetPasswordService", () => {
    let service: ResetPasswordService;
    let prisma: PrismaRepository;
    let jwtService: JwtService;
    let configService: ConfigService;

    const resetPasswordData: ResetPasswordDTO = {
        token: "valid-token",
        newPassword: "NewPassword123",
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

    const mockPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        type: "password_reset",
    };

    const mockJwtSecret = "test-secret";
    const hashedPassword = "new_hashed_password";

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ResetPasswordService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUnique: jest.fn().mockResolvedValue(mockUser),
                            update: jest.fn().mockResolvedValue(mockUser),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn().mockReturnValue(mockPayload),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(mockJwtSecret),
                    },
                },
            ],
        }).compile();

        service = module.get<ResetPasswordService>(ResetPasswordService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);

        // Mock bcrypt hash
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(configService).toBeDefined();
    });

    it("should verify token with correct secret", async () => {
        await service.execute(resetPasswordData);
        expect(jwtService.verify).toHaveBeenCalledWith(resetPasswordData.token, {
            secret: mockJwtSecret,
        });
        expect(configService.get).toHaveBeenCalledWith("JWT_SECRET");
    });

    it("should throw BadRequestException if token type is not password_reset", async () => {
        jest.spyOn(jwtService, "verify").mockReturnValueOnce({
            ...mockPayload,
            type: "other_type",
        });

        await expect(service.execute(resetPasswordData)).rejects.toThrow(
            new BadRequestException("auth.error.invalid_token"),
        );
    });

    it("should find user by id from token payload", async () => {
        await service.execute(resetPasswordData);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: mockPayload.sub },
        });
    });

    it("should throw UnauthorizedException if user not found", async () => {
        jest.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(null);

        await expect(service.execute(resetPasswordData)).rejects.toThrow(
            new UnauthorizedException("auth.error.user_not_found"),
        );
    });

    it("should hash the new password", async () => {
        await service.execute(resetPasswordData);
        expect(bcrypt.hash).toHaveBeenCalledWith(resetPasswordData.newPassword, 10);
    });

    it("should update user with new hashed password", async () => {
        await service.execute(resetPasswordData);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: mockPayload.sub },
            data: { password: hashedPassword },
        });
    });

    it("should throw UnauthorizedException on JsonWebTokenError", async () => {
        const error = new Error("Invalid token");
        error.name = "JsonWebTokenError";
        jest.spyOn(jwtService, "verify").mockImplementationOnce(() => {
            throw error;
        });

        await expect(service.execute(resetPasswordData)).rejects.toThrow(
            new UnauthorizedException("auth.error.invalid_or_expired_token"),
        );
    });

    it("should throw UnauthorizedException on TokenExpiredError", async () => {
        const error = new Error("Token expired");
        error.name = "TokenExpiredError";
        jest.spyOn(jwtService, "verify").mockImplementationOnce(() => {
            throw error;
        });

        await expect(service.execute(resetPasswordData)).rejects.toThrow(
            new UnauthorizedException("auth.error.invalid_or_expired_token"),
        );
    });

    it("should propagate other errors", async () => {
        const error = new Error("Other error");
        jest.spyOn(jwtService, "verify").mockImplementationOnce(() => {
            throw error;
        });

        await expect(service.execute(resetPasswordData)).rejects.toThrow(error);
    });
});
