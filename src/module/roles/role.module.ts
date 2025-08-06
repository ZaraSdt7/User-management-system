import { Module } from "@nestjs/common";
import { RoleGuard } from "./guard/role.guard";

@Module({

  providers: [ RoleGuard],
  exports: [RoleGuard],
})
export class RoleModule {}
