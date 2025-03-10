import { GetCurrentUserService } from "@auth/services/me/me.service";
import { Controller, Get, UseGuards, Req, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { AuthFlowRequest } from "@shared/interfaces/authflow-request.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { UserDTO } from "@user/dtos/user.schema";

@Controller("auth")
export class getCurrentUserController implements AuthFlowController {
    constructor(private readonly getCurrentUserService: GetCurrentUserService) {}

    @Get("me")
    @UseGuards(JwtAuthGuard)
    async handle(@Req() req: AuthFlowRequest): Promise<BaseResponse<UserDTO>> {
        const user = await this.getCurrentUserService.execute(req.user.id);

        return {
            data: user,
            meta: null,
            status: HttpStatus.OK,
            message: "user.get.success",
        };
    }
}
