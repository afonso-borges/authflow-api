import { Test } from "@nestjs/testing";
import { LogoutService } from "./logout.service";
import { RevokeRefreshTokenService } from "@auth/services/revoke-refresh-token/revoke-refresh-token.service";

describe("LogoutService", () => {
    let logoutService: LogoutService;
    let revokeRefreshTokenService: RevokeRefreshTokenService;
    
    const mockPrismaRepository = {
        refreshToken: {
            update: jest.fn(),
            updateMany: jest.fn(),
        },
    };
    
    const mockRevokeRefreshTokenService = {
        execute: jest.fn(),
        revokeAllUserTokens: jest.fn(),
    };
    
    const refreshToken = "valid-refresh-token";

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                LogoutService,
                {
                    provide: "PrismaRepository",
                    useValue: mockPrismaRepository,
                },
                {
                    provide: RevokeRefreshTokenService,
                    useValue: mockRevokeRefreshTokenService,
                },
            ],
        }).compile();

        logoutService = moduleRef.get<LogoutService>(LogoutService);
        revokeRefreshTokenService = moduleRef.get<RevokeRefreshTokenService>(RevokeRefreshTokenService);
        
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(logoutService).toBeDefined();
    });

    it("should call revokeRefreshTokenService.execute with the correct token", async () => {
        await logoutService.execute(refreshToken);
        
        expect(revokeRefreshTokenService.execute).toHaveBeenCalledTimes(1);
        expect(revokeRefreshTokenService.execute).toHaveBeenCalledWith(refreshToken);
    });
});
