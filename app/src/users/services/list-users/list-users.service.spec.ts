import { Test } from "@nestjs/testing";
import { ListUsersService } from "./list-users.service";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { UserPaginationDTO } from "@user/dtos/user.schema";

describe("ListUsersService", () => {
    let service: ListUsersService;
    let prisma: PrismaRepository;

    const mockUsers = [
        {
            id: "user-1",
            name: "User One",
            email: "user1@example.com",
            password: "hashedPassword1",
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "user-2",
            name: "User Two",
            email: "user2@example.com",
            password: "hashedPassword2",
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const mockUsersWithoutPassword = mockUsers.map(({ password: _, ...rest }) => rest);

    const defaultPaginationParams: UserPaginationDTO = {
        page: 1,
        limit: 10,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ListUsersService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ListUsersService>(ListUsersService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should return users without passwords and total count", async () => {
        // @ts-expect-error Typing issue
        jest.spyOn(prisma.user, "findMany").mockResolvedValue(mockUsers);
        jest.spyOn(prisma.user, "count").mockResolvedValue(mockUsers.length);

        const result = await service.execute(defaultPaginationParams);

        expect(result).toEqual({
            users: mockUsersWithoutPassword,
            total: mockUsers.length,
        });
    });

    it("should call prisma with correct pagination parameters", async () => {
        const paginationParams: UserPaginationDTO = {
            page: 2,
            limit: 5,
        };

        jest.spyOn(prisma.user, "findMany").mockResolvedValue([]);
        jest.spyOn(prisma.user, "count").mockResolvedValue(0);

        await service.execute(paginationParams);

        expect(prisma.user.findMany).toHaveBeenCalledWith({
            where: {},
            skip: 5, // (page - 1) * limit = (2 - 1) * 5 = 5
            take: 5,
            orderBy: { createdAt: "desc" },
        });
    });

    it("should apply status filter when provided", async () => {
        const paginationParams: UserPaginationDTO = {
            page: 1,
            limit: 10,
            status: "ACTIVE",
        };

        jest.spyOn(prisma.user, "findMany").mockResolvedValue([]);
        jest.spyOn(prisma.user, "count").mockResolvedValue(0);

        await service.execute(paginationParams);

        expect(prisma.user.findMany).toHaveBeenCalledWith({
            where: { status: "ACTIVE" },
            skip: 0,
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        expect(prisma.user.count).toHaveBeenCalledWith({
            where: { status: "ACTIVE" },
        });
    });

    it("should apply search filter when provided", async () => {
        const paginationParams: UserPaginationDTO = {
            page: 1,
            limit: 10,
            search: "test",
        };

        const expectedFilter = {
            OR: [
                { name: { contains: "test", mode: "insensitive" } },
                { email: { contains: "test", mode: "insensitive" } },
            ],
        };

        jest.spyOn(prisma.user, "findMany").mockResolvedValue([]);
        jest.spyOn(prisma.user, "count").mockResolvedValue(0);

        await service.execute(paginationParams);

        expect(prisma.user.findMany).toHaveBeenCalledWith({
            where: expectedFilter,
            skip: 0,
            take: 10,
            orderBy: { createdAt: "desc" },
        });
        expect(prisma.user.count).toHaveBeenCalledWith({
            where: expectedFilter,
        });
    });

    it("should apply both status and search filters when provided", async () => {
        const paginationParams: UserPaginationDTO = {
            page: 1,
            limit: 10,
            status: "ACTIVE",
            search: "test",
        };

        const expectedFilter = {
            status: "ACTIVE",
            OR: [
                { name: { contains: "test", mode: "insensitive" } },
                { email: { contains: "test", mode: "insensitive" } },
            ],
        };

        jest.spyOn(prisma.user, "findMany").mockResolvedValue([]);
        jest.spyOn(prisma.user, "count").mockResolvedValue(0);

        await service.execute(paginationParams);

        expect(prisma.user.findMany).toHaveBeenCalledWith({
            where: expectedFilter,
            skip: 0,
            take: 10,
            orderBy: { createdAt: "desc" },
        });
    });
});
