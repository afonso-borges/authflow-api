import { LoginService, RegisterService } from "@/auth/services";
import { Test } from "@nestjs/testing";
import { RegisterController } from "./register.controller";
import { AuthResponseDTO, RegisterDTO } from "@/auth/dtos/auth.schema";
import { BaseResponse } from "@/shared/interfaces/response.interface";
import { HttpStatus } from "@nestjs/common";

describe("RegisterController", () => {
    let controller: RegisterController;
    let service: RegisterService;
    let registerDTO: RegisterDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [RegisterController],
            providers: [
                {
                    provide: RegisterService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: LoginService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RegisterController>(RegisterController);
        service = module.get<RegisterService>(RegisterService);

        registerDTO = {
            name: "test",
            email: "test@mail.com",
            password: "test12354@",
        };
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call the registerService.execute with correct params", async () => {
        await controller.handle(registerDTO);
        expect(service.execute).toHaveBeenCalledWith(registerDTO);
    });

    it("should return BaseResponse with correct data", async () => {
        const authResponse = await service.execute(registerDTO);
        const result: BaseResponse<AuthResponseDTO> = await controller.handle(registerDTO);
        expect(result).toEqual({
            data: authResponse,
            meta: null,
            status: HttpStatus.CREATED,
            message: "auth.register.success",
        });
    });
});
