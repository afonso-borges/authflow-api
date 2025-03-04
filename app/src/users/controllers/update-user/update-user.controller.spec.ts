import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { UpdateUserController } from "./update-user.controller";
import { UpdateUserService } from "app/src/users/services";
import { GetMetadataService } from "@shared/utils/services/get-metadata.service";
import { UpdateUserDTO } from "@user/dtos/user.schema";

describe("UpdateUserController", () => {
    let controller: UpdateUserController;
    let service: UpdateUserService;
    let metadataService: GetMetadataService;

    const userId = "user-id-123";
    const updateUserDto: UpdateUserDTO = {
        name: "Updated User Name",
        status: "ACTIVE",
    };

    const mockUpdatedUser = {
        id: userId,
        name: "Updated User Name",
        email: "user@example.com",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UpdateUserController],
            providers: [
                {
                    provide: UpdateUserService,
                    useValue: {
                        execute: jest.fn(() => mockUpdatedUser),
                    },
                },
                {
                    provide: GetMetadataService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UpdateUserController>(UpdateUserController);
        service = module.get<UpdateUserService>(UpdateUserService);
        metadataService = module.get<GetMetadataService>(GetMetadataService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.execute with userId and updateUserDto", async () => {
        await controller.handle(userId, updateUserDto);
        expect(service.execute).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it("should return BaseResponse with updated user data", async () => {
        const result = await controller.handle(userId, updateUserDto);
        expect(result).toEqual({
            data: mockUpdatedUser,
            meta: null,
            message: "user.update.success",
            status: HttpStatus.OK,
        });
    });
});
