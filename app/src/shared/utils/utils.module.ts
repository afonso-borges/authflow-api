import { Module } from "@nestjs/common";
import { GetMetadataService } from "./services/get-metadata.service";

@Module({
    providers: [GetMetadataService],
    exports: [GetMetadataService],
})
export class UtilsModule {}
