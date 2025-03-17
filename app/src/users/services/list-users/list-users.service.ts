import { UserDTO, UserPaginationDTO, userStatusEnum } from "app/src/users/dtos/user.schema";
import { Service } from "@shared/interfaces/service.interface";
import { PrismaRepository } from "@shared/repositories/prisma.repository";
import { Inject, Injectable } from "@nestjs/common";

// Interface for user filters
interface UserWhereInput {
    status?: typeof userStatusEnum._type;
    OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
    }>;
}

interface ListUsersResponse {
    users: UserDTO[];
    total: number;
}

@Injectable()
export class ListUsersService implements Service {
    constructor(
        @Inject("PrismaRepository")
        private readonly prisma: PrismaRepository,
    ) {}

    async execute(params: UserPaginationDTO): Promise<ListUsersResponse> {
        const { page, limit, status, search } = params;
        const skip = (page - 1) * limit;

        // Build the where clause based on the filters
        const where: UserWhereInput = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const total = await this.prisma.user.count({ where });

        const users = await this.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const usersWithoutPassword = users.map((user) => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return {
            users: usersWithoutPassword,
            total,
        };
    }
}
