import { Injectable, NotFoundException } from "@nestjs/common"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { ModerationResult } from "@/domain/entities/moderation.entity"

const buildFuzzyRegex = (word: string) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(escaped.split("").join("[^a-zA-Z0-9]*"), "gi")
}

@Injectable()
export class ModerationService {
    constructor(private readonly moderationRepository: ModerationRepository) {}

    async moderate(text: string): Promise<ModerationResult> {
        const words = await this.moderationRepository.findAll()

        for (const pw of words) {
            const regex = buildFuzzyRegex(pw.word)
            if (regex.test(text)) {
                return {
                    approved: false,
                    reason: `Contiene palabra prohibida: "${pw.word}"`,
                    category: pw.category,
                }
            }
        }

        return { approved: true }
    }

    findAll() {
        return this.moderationRepository.findAll()
    }

    create(word: string, category: string) {
        return this.moderationRepository.create(word, category)
    }

    async delete(id: string) {
        try {
            return await this.moderationRepository.delete(id)
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                "code" in err &&
                (err as { code: string }).code === "P2025"
            ) {
                throw new NotFoundException("Palabra prohibida no encontrada")
            }
            throw err
        }
    }
}
