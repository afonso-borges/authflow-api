import { RequestPasswordResetDTO } from "@auth/dtos/auth.schema";
import { RequestPasswordResetService } from "@auth/services/request-password-reset/request-password-reset.service";
import { Test } from "@nestjs/testing";
import { AuthFlowRequest } from "@shared/interfaces/authflow-request.interface";
import { RequestPasswordResetController } from "./request-password-reset.controller";

describe("RequestPasswordResetController", () => {
    let controller: RequestPasswordResetController;
    let service: RequestPasswordResetService;

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

    // @ts-expect-error Typing issue
    const mockRequest = {
        user: mockUser,
    } as AuthFlowRequest;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [RequestPasswordResetController],
            providers: [
                {
                    provide: RequestPasswordResetService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RequestPasswordResetController>(RequestPasswordResetController);
        service = module.get<RequestPasswordResetService>(RequestPasswordResetService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.execute with requestPasswordResetData and user data", async () => {
        await controller.handle(requestPasswordResetData, mockRequest);
        expect(service.execute).toHaveBeenCalledWith(requestPasswordResetData, mockRequest.user);
    });

    it("should return BaseResponse with null data", async () => {
        const response = await controller.handle(requestPasswordResetData, mockRequest);
        expect(response).toEqual({
            data: null,
            meta: null,
            message: "auth.password_reset.email_sent",
            status: 200,
        });
    });
});
