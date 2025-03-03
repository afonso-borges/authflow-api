export class PaginationException extends Error {
    constructor(message = "authflowApi.invalidPaginationParameters") {
        super(message);
    }
}
