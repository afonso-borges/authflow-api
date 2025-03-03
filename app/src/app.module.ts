import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@auth/auth.module";
import { envSchema } from "./config/env";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            validate: (env) => envSchema.parse(env),
        }),
        AuthModule,
    ],
    providers: [],
    exports: [],
})
export class AppModule {}
