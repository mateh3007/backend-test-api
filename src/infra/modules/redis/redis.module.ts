import { Module } from "@nestjs/common";
import { CacheAdapter } from "../../../domain/adapters";
import { RedisIntegration } from "src/infra/integrations";

@Module({
   providers: [
    {
        provide: CacheAdapter,
        useClass: RedisIntegration
    }
   ],
   exports: [CacheAdapter]
})
export class RedisModule {}