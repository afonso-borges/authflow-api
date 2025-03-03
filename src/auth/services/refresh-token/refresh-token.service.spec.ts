import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { CreateRefreshTokenService } from "../create-refresh-token/create-refresh-token.service";
import { RevokeRefreshTokenService } from "../revoke-refresh-token/revoke-refresh-token.service";
import { ValidateRefreshTokenService } from "../validate-refresh-token/validate-refresh-token.service";
import { RefreshTokenService } from "./refresh-token.service";
import { AuthUserDTO } from "@/auth/dtos/auth.schema";

describe("RefreshTokenService", () => {
    let service: RefreshTokenService;
    let jwtService: JwtService;
    let revokeRefreshTokenService: RevokeRefreshTokenService;
    let createRefreshTokenService: CreateRefreshTokenService;
    let validateRefreshTokenService: ValidateRefreshTokenService;

    const userData: AuthUserDTO = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockValidateResponse = {
        userId: "1",
        user: userData,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RefreshTokenService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => "Generated access-token"),
                    },
                },
                {
                    provide: RevokeRefreshTokenService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: CreateRefreshTokenService,
                    useValue: {
                        execute: jest.fn().mockResolvedValue("Generated refresh-token"),
                    },
                },
                {
                    provide: ValidateRefreshTokenService,
                    useValue: {
                        execute: jest.fn().mockResolvedValue(mockValidateResponse),
                    },
                },
            ],
        }).compile();

        service = module.get<RefreshTokenService>(RefreshTokenService);
        jwtService = module.get<JwtService>(JwtService);
        revokeRefreshTokenService =
            module.get<RevokeRefreshTokenService>(RevokeRefreshTokenService);
        createRefreshTokenService =
            module.get<CreateRefreshTokenService>(CreateRefreshTokenService);
        validateRefreshTokenService = module.get<ValidateRefreshTokenService>(
            ValidateRefreshTokenService,
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should call jwtService.sign with correct params", async () => {
        await service.execute("test-token");
        expect(jwtService.sign).toHaveBeenCalledWith({ sub: "1" });
    });
    it("should call createRefreshTokenService.execute with correct params", async () => {
        await service.execute("test-token");
        expect(createRefreshTokenService.execute).toHaveBeenCalledWith("1");
    });

    it("should call validateRefreshTokenService.execute with correct params", async () => {
        await service.execute("test-token");
        expect(validateRefreshTokenService.execute).toHaveBeenCalledWith("test-token");
    });

    it("should call revokeRefreshTokenService.execute with correct params", async () => {
        await service.execute("test-token");
        expect(revokeRefreshTokenService.execute).toHaveBeenCalledWith("test-token");
    });

    it("should return the correct response structure", async () => {
        const result = await service.execute("test-token");

        expect(result).toEqual({
            access_token: "Generated access-token",
            refresh_token: "Generated refresh-token",
            user: userData,
        });
    });
});
