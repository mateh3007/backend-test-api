import { Module } from "@nestjs/common";
import { JwtAdapter } from "../../../domain/adapters";
import { JwtIntegration } from "../../integrations";

@Module({
   providers: [
    {
        provide: JwtAdapter,
        useClass: JwtIntegration
    }
   ],
   exports: [JwtAdapter]
})
export class JwtModule {}