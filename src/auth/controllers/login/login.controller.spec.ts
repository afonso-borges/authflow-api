import { Test } from "@nestjs/testing";

import { LoginService } from "../../services";

import { LoginController } from "./login.controller";

import { LoginDTO } from "@/auth/dtos/auth.schema";

describe("LoginController", () => {
    let controller: LoginController;
    let service: LoginService;

    const loginData: LoginDTO = {
        email: "test@mail",
        password: "test12354@",
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [
                {
                    provide: LoginService,
                    useValue: {
                        execute: jest.fn(() => "Login data"),
                    },
                },
            ],
        }).compile();

        controller = module.get<LoginController>(LoginController);
        service = module.get<LoginService>(LoginService);
    });

    it("should call service.execute with loginData", async () => {
        await controller.handle(loginData);
        expect(service.execute).toHaveBeenCalledWith(loginData);
    });

    it("should return BaseResponse with Login Data", async () => {
        const data = await controller.handle(loginData);
        expect(data).toEqual({
            data: "Login data",
            meta: null,
            message: "auth.login.success",
            status: 200,
        });
    });
});
