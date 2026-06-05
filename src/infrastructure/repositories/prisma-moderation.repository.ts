import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { ProhibitedWord } from "@/domain/entities/moderation.entity"

@Injectable()
export class PrismaModerationRepository implements ModerationRepository {
    constructor(private readonly prisma: PrismaService) {}

    findAll(): Promise<ProhibitedWord[]> {
        return this.prisma.prohibitedWord.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    create(word: string, category: string): Promise<ProhibitedWord> {
        return this.prisma.prohibitedWord.create({ data: { word, category } })
    }

    delete(id: string): Promise<ProhibitedWord> {
        return this.prisma.prohibitedWord.delete({ where: { id } })
    }
}
