import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { GetUserService } from "./get-user.service";

describe("GetUserService", () => {
    let service: GetUserService;
    let prisma: PrismaRepository;

    const userId = "user-id-123";
    const mockUser = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUserWithoutPassword = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GetUserService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<GetUserService>(GetUserService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should call prisma.user.findUnique with correct params", async () => {
        // @ts-expect-error Typing issue
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

        await service.execute(userId);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: userId },
        });
    });

    it("should return user without password when user is found", async () => {
        // @ts-expect-error Typing issue
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

        const result = await service.execute(userId);

        expect(result).toEqual(mockUserWithoutPassword);
    });

    it("should throw NotFoundException when user is not found", async () => {
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

        await expect(service.execute(userId)).rejects.toThrow(
            new NotFoundException("user.error.not_found"),
        );
    });
});
