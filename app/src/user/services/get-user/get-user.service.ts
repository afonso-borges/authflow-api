import { UserDTO } from "@user/dtos/user.schema";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetUserService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(id: string): Promise<UserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException("user.error.not_found");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
