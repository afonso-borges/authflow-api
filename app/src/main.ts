import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ZodErrorFilter } from "@filters/zod-error.filter";
import { ResponseStatusInterceptor } from "@interceptors/response.interceptor";
import { ConfigService } from "@nestjs/config";
import { Env } from "@config/env";
import { UnexpectedExceptionsFilter } from "./shared/filters/unexpected-exceptions.filter";
import { HttpExceptionsFilter } from "./shared/filters/http-exceptions.filter";
import { PrismaClientKnownRequestErrorFilter } from "./shared/filters/prisma-client-known-request-error.filter";
import { PaginationExceptionFilter } from "./shared/filters/pagination-exception.filter";

async function bootstrap() {
    const logger = new Logger("Bootstrap");
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: ["error", "warn", "log", "debug", "verbose"],
    });

    // Global pipes configuration
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    ).useGlobalInterceptors(new ResponseStatusInterceptor());

    const configService = app.get<ConfigService<Env, true>>(ConfigService);

    app.useGlobalFilters(
        new UnexpectedExceptionsFilter(),
        new HttpExceptionsFilter(),
        new PrismaClientKnownRequestErrorFilter(),
        new ZodErrorFilter(),
        new PaginationExceptionFilter(),
    );

    app.enableCors({
        origin: configService.get<string>("CORS_ORIGIN"),
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });

    const port = configService.get<number>("PORT");
    await app.listen(port, "0.0.0.0");
    logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
