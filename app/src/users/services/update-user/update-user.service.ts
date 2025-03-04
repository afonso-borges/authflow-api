import { UpdateUserDTO, UserDTO, userStatusEnum } from "app/src/users/dtos/user.schema";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hash } from "bcrypt";

// Interface para os dados de atualização do usuário
interface UserUpdateData {
    name?: string;
    status?: typeof userStatusEnum._type;
    password?: string;
}

@Injectable()
export class UpdateUserService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(id: string, updateUserDto: UpdateUserDTO): Promise<UserDTO> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException("user.error.not_found");
        }

        const updateData: UserUpdateData = {};

        if (updateUserDto.name) {
            updateData.name = updateUserDto.name;
        }

        if (updateUserDto.status) {
            updateData.status = updateUserDto.status;
        }

        if (updateUserDto.password) {
            updateData.password = await hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}
