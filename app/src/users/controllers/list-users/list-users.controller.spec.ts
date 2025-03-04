import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { ListUsersController } from "./list-users.controller";
import { ListUsersService } from "app/src/users/services";
import { GetMetadataService } from "@shared/utils/services/get-metadata.service";
import { UserPaginationDTO } from "app/src/users/dtos/user.schema";
import { MetadataPaginatedInfo } from "@shared/interfaces/response.interface";

describe("ListUsersController", () => {
    let controller: ListUsersController;
    let service: ListUsersService;
    let metadataService: GetMetadataService;

    const mockPaginationParams: UserPaginationDTO = {
        page: 1,
        limit: 10,
    };

    const mockUsers = [
        {
            id: "user-1",
            name: "User One",
            email: "user1@example.com",
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "user-2",
            name: "User Two",
            email: "user2@example.com",
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockMetadata: MetadataPaginatedInfo = {
        type: "paginated",
        currentPage: 1,
        next: 2,
        prev: null,
        lastPage: 3,
        perPage: 10,
        total: 25,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ListUsersController],
            providers: [
                {
                    provide: ListUsersService,
                    useValue: {
                        execute: jest.fn(() => ({
                            users: mockUsers,
                            total: 25,
                        })),
                    },
                },
                {
                    provide: GetMetadataService,
                    useValue: {
                        execute: jest.fn(() => mockMetadata),
                    },
                },
            ],
        }).compile();

        controller = module.get<ListUsersController>(ListUsersController);
        service = module.get<ListUsersService>(ListUsersService);
        metadataService = module.get<GetMetadataService>(GetMetadataService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.execute with pagination params", async () => {
        await controller.handle(mockPaginationParams);
        expect(service.execute).toHaveBeenCalledWith(mockPaginationParams);
    });

    it("should call metadataService.execute with correct parameters", async () => {
        await controller.handle(mockPaginationParams);
        expect(metadataService.execute).toHaveBeenCalledWith(
            mockPaginationParams.page,
            25, // total from service response
            mockPaginationParams.limit
        );
    });

    it("should return BaseResponse with users data and metadata", async () => {
        const result = await controller.handle(mockPaginationParams);
        expect(result).toEqual({
            data: mockUsers,
            meta: mockMetadata,
            message: "user.list.success",
            status: HttpStatus.OK,
        });
    });

    it("should handle different pagination parameters", async () => {
        const customParams: UserPaginationDTO = {
            page: 2,
            limit: 5,
            status: "ACTIVE",
            search: "test",
        };

        await controller.handle(customParams);
        
        expect(service.execute).toHaveBeenCalledWith(customParams);
    });
});
