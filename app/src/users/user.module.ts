import { prismaInstance } from "@shared/repositories/prisma.repository";
import { Module } from "@nestjs/common";
import { UtilsModule } from "@shared/utils/utils.module";
import * as UserControllers from "./controllers";
import * as UserServices from "./services";

@Module({
    imports: [UtilsModule],
    controllers: [...Object.values(UserControllers)],
    providers: [
        {
            provide: "PrismaRepository",
            useValue: prismaInstance,
        },
        ...Object.values(UserServices),
    ],
    exports: [],
})
export class UserModule {}
