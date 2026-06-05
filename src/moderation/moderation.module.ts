import { Module } from "@nestjs/common"
import { PrismaModerationRepository } from "@/infrastructure/repositories/prisma-moderation.repository"
import { ModerationController } from "@/moderation/moderation.controller"
import { ModerationService } from "@/moderation/moderation.service"
import { ModerationDomainService } from "@/domain/services/moderation-domain.service"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { PrismaModerationRepository } from "@/infrastructure/repositories/prisma-moderation.repository"

@Module({
    controllers: [ModerationController],
    providers: [
        ModerationService,
        ModerationDomainService,
        {
            provide: ModerationRepository,
            useClass: PrismaModerationRepository,
        },
    ],
    exports: [ModerationDomainService, ModerationRepository],
})
export class ModerationModule {}
