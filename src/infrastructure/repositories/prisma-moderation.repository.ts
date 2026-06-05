import { Injectable } from "@nestjs/common"
import {
    ModerationRepository,
    ProhibitedWordEntity,
} from "@/domain/repositories/moderation.repository"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaModerationRepository extends ModerationRepository {
    constructor(private readonly prisma: PrismaService) {
        super()
    }

    async findAllProhibitedWords(): Promise<ProhibitedWordEntity[]> {
        return this.prisma.prohibitedWord.findMany()
    }
}
