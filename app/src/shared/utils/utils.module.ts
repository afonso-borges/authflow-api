import { Module } from "@nestjs/common";
import { GetMetadataService } from "./services/get-metadata.service";
import { MailService } from "./services/mail.service";

@Module({
    providers: [GetMetadataService, MailService],
    exports: [GetMetadataService, MailService],
})
export class UtilsModule {}
