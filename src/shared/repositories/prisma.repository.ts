/**
 * Prisma base repository
 *
 * Implements the `onModuleInit` and `OnModuleDestroy` interfaces to connect
 * and disconnect from the database when the app starts and stops.
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
class BasePrismaRepository extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: process.env.NODE_ENV !== "development" ? ["error"] : ["query", "info", "warn"],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

export const prismaInstance = new BasePrismaRepository();

export type PrismaRepository = typeof prismaInstance;
