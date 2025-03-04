import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { GetUserController } from "./get-user.controller";
import { GetUserService } from "app/src/users/services";
import { UserDTO } from "app/src/users/dtos/user.schema";

describe("GetUserController", () => {
    let controller: GetUserController;
    let service: GetUserService;

    const userId = "user-id-123";
    const mockUser: UserDTO = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "ACTIVE",
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [GetUserController],
            providers: [
                {
                    provide: GetUserService,
                    useValue: {
                        execute: jest.fn(() => mockUser),
                    },
                },
            ],
        }).compile();

        controller = module.get<GetUserController>(GetUserController);
        service = module.get<GetUserService>(GetUserService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.execute with userId", async () => {
        await controller.handle(userId);
        expect(service.execute).toHaveBeenCalledWith(userId);
    });

    it("should return BaseResponse with user data", async () => {
        const response = await controller.handle(userId);
        expect(response).toEqual({
            data: mockUser,
            meta: null,
            message: "user.get.success",
            status: HttpStatus.OK,
        });
    });
});
