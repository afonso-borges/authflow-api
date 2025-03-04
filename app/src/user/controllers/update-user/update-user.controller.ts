import { UserDTO, UpdateUserDTO, updateUserSchema } from "@user/dtos/user.schema";
import { UpdateUserService } from "@user/services";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";
import { Controller, Put, Param, Body, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UpdateUserController implements AuthFlowController {
    constructor(private readonly updateUserService: UpdateUserService) {}

    @Put(":id")
    async handle(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDTO,
    ): Promise<BaseResponse<UserDTO>> {
        const updatedUser = await this.updateUserService.execute(id, updateUserDto);

        return {
            data: updatedUser,
            meta: null,
            status: HttpStatus.OK,
            message: "user.update.success",
        };
    }
}
