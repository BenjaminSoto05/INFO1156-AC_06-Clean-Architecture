import { Injectable } from "@nestjs/common"
import { ProhibitedWordEntity } from "@/domain/repositories/moderation.repository"

export type ModerationResult = {
    approved: boolean
    reason?: string
    category?: string
}

const buildFuzzyRegex = (word: string) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(escaped.split("").join("[^a-zA-Z0-9]*"), "gi")
}

@Injectable()
export class ModerationDomainService {
    moderate(
        text: string,
        prohibitedWords: ProhibitedWordEntity[],
    ): ModerationResult {
        for (const pw of prohibitedWords) {
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
}
