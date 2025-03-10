import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { LogoutController } from "./logout.controller";
import { LogoutService } from "@auth/services/logout/logout.service";

describe("LogoutController", () => {
    let logoutController: LogoutController;
    let logoutService: LogoutService;
    
    const mockLogoutService = {
        execute: jest.fn(),
    };
    
    const refreshTokenDto = {
        refresh_token: "valid-refresh-token",
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [LogoutController],
            providers: [
                {
                    provide: LogoutService,
                    useValue: mockLogoutService,
                },
            ],
        }).compile();

        logoutController = moduleRef.get<LogoutController>(LogoutController);
        logoutService = moduleRef.get<LogoutService>(LogoutService);
        
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(logoutController).toBeDefined();
    });

    describe("handle", () => {
        it("should call logoutService.execute with correct refresh token", async () => {
            await logoutController.handle(refreshTokenDto);
            
            expect(logoutService.execute).toHaveBeenCalledTimes(1);
            expect(logoutService.execute).toHaveBeenCalledWith(refreshTokenDto.refresh_token);
        });

        it("should return a successful response", async () => {
            const result = await logoutController.handle(refreshTokenDto);
            
            expect(result).toEqual({
                data: null,
                meta: null,
                status: HttpStatus.OK,
                message: "auth.logout.success",
            });
        });
    });
});
