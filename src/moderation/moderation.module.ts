import { Module } from "@nestjs/common"
import { ModerationController } from "@/moderation/moderation.controller"
import { ModerationService } from "@/moderation/moderation.service"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { PrismaModerationRepository } from "@/infrastructure/repositories/prisma-moderation.repository"

@Module({
    controllers: [ModerationController],
    providers: [
        ModerationService,
        {
            provide: ModerationRepository,
            useClass: PrismaModerationRepository,
        },
    ],
    exports: [ModerationService],
})
export class ModerationModule {}
