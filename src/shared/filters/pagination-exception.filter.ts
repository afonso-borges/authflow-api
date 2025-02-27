import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { BaseResponse } from "../interfaces/response.interface";
import { PaginationException } from "../exceptions/pagination.exception";

/**
 * Catch all pagination related errors.
 *
 * Currently pagination errors are thrown by the `GetMetadataService` service only.
 */
@Catch(PaginationException)
export class PaginationExceptionFilter implements ExceptionFilter<PaginationException> {
    async catch(error: PaginationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        if (process.env.NODE_ENV === "development") console.error(error);

        return response.status(HttpStatus.BAD_REQUEST).send({
            data: null,
            message: error.message,
            meta: null,
            status: HttpStatus.BAD_REQUEST,
        } as BaseResponse<null>);
    }
}
