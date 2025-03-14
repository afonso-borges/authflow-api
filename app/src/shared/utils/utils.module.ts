import { Module } from "@nestjs/common";
import * as UtilsServices from "./index";

@Module({
    providers: [...Object.values(UtilsServices)],
    exports: [...Object.values(UtilsServices)],
})
export class UtilsModule {}
