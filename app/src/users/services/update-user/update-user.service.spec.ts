import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { UpdateUserService } from "./update-user.service";
import { UpdateUserDTO, userStatusEnum } from "@user/dtos/user.schema";
import * as bcrypt from "bcrypt";

// Mock bcrypt para não precisar calcular hash real nos testes
jest.mock("bcrypt", () => ({
    hash: jest.fn(() => "mocked_hashed_password"),
}));

describe("UpdateUserService", () => {
    let service: UpdateUserService;
    let prisma: PrismaRepository;

    const userId = "user-id-123";
    const updateUserDto: UpdateUserDTO = {
        name: "Updated User Name",
        status: "ACTIVE" as typeof userStatusEnum._type,
    };

    const mockUser = {
        id: userId,
        name: "Original User Name",
        email: "user@example.com",
        password: "hashed_password",
        status: "INACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUpdatedUser = {
        ...mockUser,
        name: "Updated User Name",
        status: "ACTIVE",
    };

    const mockUpdatedUserWithoutPassword = {
        id: userId,
        name: "Updated User Name",
        email: "user@example.com",
        status: "ACTIVE",
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UpdateUserService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<UpdateUserService>(UpdateUserService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should throw NotFoundException when user is not found", async () => {
        // @ts-ignore
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

        await expect(service.execute(userId, updateUserDto)).rejects.toThrow(
            new NotFoundException("user.error.not_found"),
        );
    });

    it("should update user name and status when provided", async () => {
        // @ts-ignore
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
        // @ts-ignore
        jest.spyOn(prisma.user, "update").mockResolvedValue(mockUpdatedUser);

        await service.execute(userId, updateUserDto);

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: {
                name: updateUserDto.name,
                status: updateUserDto.status,
            },
        });
    });

    it("should hash password when password is provided", async () => {
        const dtoWithPassword: UpdateUserDTO = {
            ...updateUserDto,
            password: "new_password",
        };

        // @ts-ignore
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
        // @ts-ignore
        jest.spyOn(prisma.user, "update").mockResolvedValue(mockUpdatedUser);

        await service.execute(userId, dtoWithPassword);

        expect(bcrypt.hash).toHaveBeenCalledWith("new_password", 10);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: {
                name: dtoWithPassword.name,
                status: dtoWithPassword.status,
                password: "mocked_hashed_password",
            },
        });
    });

    it("should return user without password", async () => {
        // @ts-ignore
        jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
        // @ts-ignore
        jest.spyOn(prisma.user, "update").mockResolvedValue(mockUpdatedUser);

        const result = await service.execute(userId, updateUserDto);

        expect(result).toEqual(mockUpdatedUserWithoutPassword);
    });
});
