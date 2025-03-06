import { ResetPasswordDTO } from "@auth/dtos/auth.schema";
import { ResetPasswordService } from "@auth/services/reset-password/reset-password.service";
import { Test } from "@nestjs/testing";
import { ResetPasswordController } from "./reset-password.controller";

describe("ResetPasswordController", () => {
    let controller: ResetPasswordController;
    let service: ResetPasswordService;

    const resetPasswordData: ResetPasswordDTO = {
        token: "valid-token",
        newPassword: "NewPassword123",
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ResetPasswordController],
            providers: [
                {
                    provide: ResetPasswordService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ResetPasswordController>(ResetPasswordController);
        service = module.get<ResetPasswordService>(ResetPasswordService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.execute with resetPasswordData", async () => {
        await controller.handle(resetPasswordData);
        expect(service.execute).toHaveBeenCalledWith(resetPasswordData);
    });

    it("should return BaseResponse with null data", async () => {
        const response = await controller.handle(resetPasswordData);
        expect(response).toEqual({
            data: null,
            meta: null,
            message: "auth.password_reset.success",
            status: 200,
        });
    });
});
