import { RefreshTokenDTO, AuthResponseDTO } from "@auth/dtos/auth.schema";
import { RefreshTokenService } from "@auth/services";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RefreshTokenController } from "./refresh-token.controller";

describe("RefreshTokenController", () => {
    let controller: RefreshTokenController;
    let service: RefreshTokenService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [RefreshTokenController],
            providers: [
                {
                    provide: RefreshTokenService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RefreshTokenController>(RefreshTokenController);
        service = module.get<RefreshTokenService>(RefreshTokenService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call refreshTokenService.execute with correct params", async () => {
        const refreshTokenDTO: RefreshTokenDTO = {
            refresh_token: "test",
        };
        await controller.handle(refreshTokenDTO);
        expect(service.execute).toHaveBeenCalledWith(refreshTokenDTO.refresh_token);
    });

    it("should return correct response structure", async () => {
        const refreshTokenDTO: RefreshTokenDTO = {
            refresh_token: "test",
        };
        const response: AuthResponseDTO = {
            access_token: "test",
            refresh_token: "test",
            user: {
                id: "test",
                email: "test@mail",
                name: "test",
                status: "ACTIVE",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };

        jest.spyOn(service, "execute").mockResolvedValue(response);

        const result: BaseResponse<AuthResponseDTO> = await controller.handle(refreshTokenDTO);

        expect(result).toEqual({
            data: response,
            meta: null,
            status: HttpStatus.OK,
            message: "auth.token.refreshed",
        });
    });
});
