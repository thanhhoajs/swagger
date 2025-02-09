import { Module } from "@thanhhoajs/thanhhoa";

import { SwaggerService } from "./swagger.service";

@Module({
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}
