import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Test } from "@nestjs/testing";
import { RegisterService } from "./register.service";
import { RegisterDTO } from "@auth/dtos/auth.schema";

// Mock bcrypt
jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashed_password"),
}));

describe("RegisterService", () => {
    let service: RegisterService;
    let prisma: PrismaRepository;
    let userData: RegisterDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RegisterService,
                {
                    provide: "PrismaRepository",
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn().mockResolvedValue({
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

        service = module.get<RegisterService>(RegisterService);
        prisma = module.get<PrismaRepository>("PrismaRepository");

        userData = {
            name: "test",
            email: "test@mail.com",
            password: "test12354@",
        };
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it("should call prisma.user.findUnique with correct params", () => {
        service.execute(userData);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: userData.email },
        });
    });

    it("should call prisma.user.create with correct params", async () => {
        await service.execute(userData);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: userData.name,
                email: userData.email,
                password: "hashed_password",
                status: "ACTIVE",
            },
        });
    });
});
