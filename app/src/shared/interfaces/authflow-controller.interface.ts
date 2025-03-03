import { BaseResponse } from "./response.interface";

/**
 * Controller of the AuthFlow application.
 *
 * It handles HTTP requests and returns responses.
 *
 * All responses are wrapped in a BaseResponse object.
 */
export interface AuthFlowController {
    /**
     * Handles the request.
     *
     * @param args - The arguments of the request. It can be the body, params, query, etc.
     *
     * @returns A BaseResponse containing the data returned by the service.
     */

    handle: (...args: any[]) => Promise<BaseResponse<any>>;
}
