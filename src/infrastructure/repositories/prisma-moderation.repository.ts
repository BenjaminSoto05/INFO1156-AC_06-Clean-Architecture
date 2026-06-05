import { Injectable } from "@nestjs/common"

import {
    IModerationRepository,
    ProhibitedWordRecord,
} from "@/domain/repositories/moderation.repository"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaModerationRepository implements IModerationRepository {
    constructor(private readonly prisma: PrismaService) {}

    listProhibitedWords(): Promise<ProhibitedWordRecord[]> {
        return this.prisma.prohibitedWord.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    createProhibitedWord(
        word: string,
        category: string,
    ): Promise<ProhibitedWordRecord> {
        return this.prisma.prohibitedWord.create({ data: { word, category } })
    }

    async deleteProhibitedWordById(
        id: string,
    ): Promise<ProhibitedWordRecord | null> {
        try {
            return await this.prisma.prohibitedWord.delete({ where: { id } })
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                "code" in err &&
                (err as { code: string }).code === "P2025"
            ) {
                return null
            }
            throw err
        }
    }
}
