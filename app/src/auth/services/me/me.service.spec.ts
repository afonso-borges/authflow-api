import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { GetCurrentUserService } from "./me.service";
import { UserDTO } from "@user/dtos/user.schema";

describe("GetCurrentUserService", () => {
    let getCurrentUserService: GetCurrentUserService;
    
    const mockUser: UserDTO = {
        id: "user-id",
        email: "user@example.com",
        name: "Test User",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    const mockPrismaRepository = {
        user: {
            findUnique: jest.fn(),
        },
    };
    
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GetCurrentUserService,
                {
                    provide: "PrismaRepository",
                    useValue: mockPrismaRepository,
                },
            ],
        }).compile();

        getCurrentUserService = moduleRef.get<GetCurrentUserService>(GetCurrentUserService);
        
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(getCurrentUserService).toBeDefined();
    });

    describe("execute", () => {
        it("should return user when found", async () => {
            mockPrismaRepository.user.findUnique.mockResolvedValue(mockUser);
            
            const result = await getCurrentUserService.execute(mockUser.id);
            
            expect(mockPrismaRepository.user.findUnique).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual(mockUser);
        });

        it("should throw NotFoundException when user is not found", async () => {
            mockPrismaRepository.user.findUnique.mockResolvedValue(null);
            
            await expect(getCurrentUserService.execute("non-existent-id")).rejects.toThrow(
                new NotFoundException("user.error.not_found")
            );
            
            expect(mockPrismaRepository.user.findUnique).toHaveBeenCalledWith({
                where: { id: "non-existent-id" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    });
});
