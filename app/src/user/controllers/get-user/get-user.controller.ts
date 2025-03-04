import { UserDTO } from "@user/dtos/user.schema";
import { GetUserService } from "@user/services";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { Controller, Get, Param, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class GetUserController implements AuthFlowController {
    constructor(private readonly getUserService: GetUserService) {}

    @Get(":id")
    async handle(@Param("id") id: string): Promise<BaseResponse<UserDTO>> {
        const user = await this.getUserService.execute(id);

        return {
            data: user,
            meta: null,
            status: HttpStatus.OK,
            message: "user.get.success",
        };
    }
}
