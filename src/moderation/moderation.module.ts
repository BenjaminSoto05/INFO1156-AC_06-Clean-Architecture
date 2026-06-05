import { Module } from "@nestjs/common"
import { PrismaModerationRepository } from "@/infrastructure/repositories/prisma-moderation.repository"
import { ModerationController } from "@/moderation/moderation.controller"
import { ModerationService } from "@/moderation/moderation.service"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { PrismaModerationRepository } from "@/infrastructure/repositories/prisma-moderation.repository"

@Module({
    controllers: [ModerationController],
    providers: [
        ModerationService,
        {
            provide: "MODERATION_REPOSITORY",
            useClass: PrismaModerationRepository,
        },
    ],
    exports: [ModerationService],
})
export class ModerationModule {}
