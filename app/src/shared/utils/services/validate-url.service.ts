import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Service } from "@shared/interfaces/service.interface";

@Injectable()
export class ValidateUrlService implements Service {
    constructor(private readonly configService: ConfigService) {}

    async execute(url: string): Promise<string> {
        if (!url) {
            throw new BadRequestException("url.error.no_url_provided");
        }

        try {
            const parsedUrl = new URL(url);
            console.log(parsedUrl);

            if (
                this.configService.get<string>("NODE_ENV") === "production" &&
                parsedUrl.protocol !== "https:"
            ) {
                throw new Error("url.error.invalid_url");
            }

            const allowedDomains = (this.configService.get<string>("ALLOWED_DOMAINS") || "").split(
                ",",
            );

            if (allowedDomains.length > 0 && !allowedDomains.includes(parsedUrl.hostname)) {
                throw new Error("url.error.invalid_url_domain");
            }

            return url;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
