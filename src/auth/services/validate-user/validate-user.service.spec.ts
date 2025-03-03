import { LoginDTO } from "@/auth/dtos/auth.schema";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { ValidateUserService } from "./validate-user.service";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcrypt";

// Mock bcrypt
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));

describe("ValidateUserService", () => {
    let service: ValidateUserService;
    let prisma: PrismaRepository;

    let userData: LoginDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ValidateUserService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUnique: jest.fn().mockResolvedValue({
                                id: "1",
                                name: "test",
                                email: "test@mail.com",
                                password: "hashed_password",
                                status: "ACTIVE",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ValidateUserService>(ValidateUserService);
        prisma = module.get<PrismaRepository>("PrismaRepository");

        userData = {
            email: "test@mail.com",
            password: "hashed_password",
        };

        jest.clearAllMocks();
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should call prisma.user.findUnique with correct params", async () => {
        await service.execute(userData.email, userData.password);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "test@mail.com" },
        });
    });
});
