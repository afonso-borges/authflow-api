import { UserDTO, UserPaginationDTO, userPaginationSchema } from "app/src/users/dtos/user.schema";
import { ListUsersService } from "app/src/users/services";
import { AuthFlowController } from "@shared/interfaces/authflow-controller.interface";
import { BaseResponse } from "@shared/interfaces/response.interface";
import { ZodValidationPipe } from "@shared/pipes/zod-validation-pipe";
import { Controller, Get, Query, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { GetMetadataService } from "@shared/utils/services/get-metadata.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class ListUsersController implements AuthFlowController {
    constructor(
        private readonly listUsersService: ListUsersService,
        private readonly getMetadataService: GetMetadataService,
    ) {}

    @Get()
    async handle(
        @Query(new ZodValidationPipe(userPaginationSchema)) query: UserPaginationDTO,
    ): Promise<BaseResponse<UserDTO[]>> {
        const { users, total } = await this.listUsersService.execute(query);
        const metadata = await this.getMetadataService.execute(query.page, total, query.limit);

        return {
            data: users,
            meta: metadata,
            status: HttpStatus.OK,
            message: "user.list.success",
        };
    }
}
