import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { CreateRefreshTokenService } from "../create-refresh-token/create-refresh-token.service";
import { GenerateTokensService } from "./generate-token.service";

describe("GenerateTokensService", () => {
    let service: GenerateTokensService;
    let jwtService: JwtService;
    let createRefreshTokenService: CreateRefreshTokenService;
    let user: { id: string; email: string };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GenerateTokensService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => "Generated token"),
                    },
                },
                {
                    provide: CreateRefreshTokenService,
                    useValue: {
                        execute: jest.fn().mockResolvedValue("Generated refresh token"),
                    },
                },
            ],
        }).compile();

        service = module.get<GenerateTokensService>(GenerateTokensService);
        jwtService = module.get<JwtService>(JwtService);
        createRefreshTokenService =
            module.get<CreateRefreshTokenService>(CreateRefreshTokenService);

        user = { id: "1", email: "test@example.com" };
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(createRefreshTokenService).toBeDefined();
    });

    it("should call jwtService.sign with correct params", () => {
        service.execute(user.id);

        expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id });
    });

    it("should call createRefreshTokenService.execute with correct params", () => {
        const user = { id: "1", email: "test@example.com" };

        service.execute(user.id);

        expect(createRefreshTokenService.execute).toHaveBeenCalledWith(user.id);
    });

    it("should return an object with access_token and refresh_token", async () => {
        const tokens = await service.execute(user.id);

        expect(tokens).toEqual({
            accessToken: "Generated token",
            refreshToken: "Generated refresh token",
        });
    });
});
