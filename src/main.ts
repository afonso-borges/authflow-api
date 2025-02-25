import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ZodErrorFilter } from "@filters/zod-error.filter";
// import { ResponseStatusInterceptor } from "@interceptors/response.interceptor";
import { ConfigService } from "@nestjs/config";
import { Env } from "@config/env";

async function bootstrap() {
    const logger = new Logger("Bootstrap");
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: ["error", "warn", "log", "debug", "verbose"],
    });

    // Configuração global de pipes
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const configService = app.get<ConfigService<Env, true>>(ConfigService);

    // Prefixo global para todas as rotas
    app.setGlobalPrefix("api");

    // Filtro de exceção para erros do Zod
    app.useGlobalFilters(new ZodErrorFilter());

    app.enableCors({
        origin: configService.get<string>("CORS_ORIGIN"),
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });

    const port = configService.get<number>("PORT");
    await app.listen(port, "0.0.0.0");
    logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
