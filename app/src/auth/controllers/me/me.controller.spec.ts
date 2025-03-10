import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { getCurrentUserController } from "./me.controller";
import { GetCurrentUserService } from "@auth/services/me/me.service";
import { UserDTO } from "@user/dtos/user.schema";
import { AuthFlowRequest } from "@shared/interfaces/authflow-request.interface";

describe("getCurrentUserController", () => {
    let controller: getCurrentUserController;
    let getCurrentUserService: GetCurrentUserService;
    
    const mockUser: UserDTO = {
        id: "user-id",
        email: "user@example.com",
        name: "Test User",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    const mockGetCurrentUserService = {
        execute: jest.fn(),
    };
    
    const mockRequest = {
        user: {
            id: mockUser.id,
        },
    } as AuthFlowRequest;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [getCurrentUserController],
            providers: [
                {
                    provide: GetCurrentUserService,
                    useValue: mockGetCurrentUserService,
                },
            ],
        }).compile();

        controller = moduleRef.get<getCurrentUserController>(getCurrentUserController);
        getCurrentUserService = moduleRef.get<GetCurrentUserService>(GetCurrentUserService);
        
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("handle", () => {
        it("should call getCurrentUserService.execute with correct user id", async () => {
            mockGetCurrentUserService.execute.mockResolvedValue(mockUser);
            
            await controller.handle(mockRequest);
            
            expect(getCurrentUserService.execute).toHaveBeenCalledTimes(1);
            expect(getCurrentUserService.execute).toHaveBeenCalledWith(mockUser.id);
        });

        it("should return a successful response with user data", async () => {
            mockGetCurrentUserService.execute.mockResolvedValue(mockUser);
            
            const result = await controller.handle(mockRequest);
            
            expect(result).toEqual({
                data: mockUser,
                meta: null,
                status: HttpStatus.OK,
                message: "user.get.success",
            });
        });
    });
});
