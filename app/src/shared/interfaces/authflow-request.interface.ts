/*
 * AuthFlowRequestInterface
 */

import { AuthUserDTO } from "@auth/dtos/auth.schema";
import { FastifyRequest } from "fastify";

export type AuthFlowRequest = FastifyRequest & {
    user: AuthUserDTO;
};
