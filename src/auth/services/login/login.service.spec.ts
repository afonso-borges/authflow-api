import { LoginDTO } from "@/auth/dtos/auth.schema";
import { PrismaRepository } from "@/shared/repositories/prisma.repository";
import { Test } from "@nestjs/testing";
import { LoginService } from "./login.service";
import { GenerateTokensService } from "../generate-token/generate-token.service";
import { ValidateUserService } from "../validate-user/validate-user.service";

describe("LoginService", () => {
    let service: LoginService;
    let prisma: PrismaRepository;
    let validateUser: ValidateUserService;
    let generateTokens: GenerateTokensService;

    const loginData: LoginDTO = {
        email: "test@mail.com",
        password: "test12354@",
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LoginService,
                {
                    provide: "PrismaRepository",
                    useValue: {},
                },
                {
                    provide: ValidateUserService,
                    useValue: {
                        execute: jest.fn(() => "Validated user"),
                    },
                },
                {
                    provide: GenerateTokensService,
                    useValue: {
                        execute: jest.fn(() => "Generated tokens"),
                    },
                },
            ],
        }).compile();

        service = module.get<LoginService>(LoginService);
        prisma = module.get<PrismaRepository>("PrismaRepository");
        validateUser = module.get<ValidateUserService>(ValidateUserService);
        generateTokens = module.get<GenerateTokensService>(GenerateTokensService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
        expect(validateUser).toBeDefined();
        expect(generateTokens).toBeDefined();
    });

    it("should call validateUser.execute with correct params", async () => {
        await service.execute(loginData);
        expect(validateUser.execute).toHaveBeenCalledWith(loginData.email, loginData.password);
    });

    it("should call generateTokens.execute with correct params", async () => {
        const user = { id: "1" };
        jest.spyOn(validateUser, "execute").mockResolvedValue(user as any);

        await service.execute(loginData);
        expect(generateTokens.execute).toHaveBeenCalledWith(user.id);
    });
});
