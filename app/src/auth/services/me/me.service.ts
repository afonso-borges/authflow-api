import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { UserDTO } from "@user/dtos/user.schema";

@Injectable()
export class GetCurrentUserService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(id: string): Promise<UserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException("user.error.not_found");
        }
        return user;
    }
}
