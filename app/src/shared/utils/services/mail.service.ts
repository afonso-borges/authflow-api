import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Service } from "@shared/interfaces/service.interface";
import axios from "axios";

@Injectable()
export class MailService implements Service {
    private readonly mailflowUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.mailflowUrl = this.configService.get<string>("MAILFLOW_URL") || "";
    }

    async execute(
        to: string,
        subject: string,
        templateName: string,
        data: Record<string, unknown>,
    ): Promise<void> {
        try {
            await axios.post(`${this.mailflowUrl}/api/send`, {
                to,
                subject,
                templateName,
                data,
            });
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}
