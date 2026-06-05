import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { IModerationRepository } from "@/domain/repositories/moderation.repository"
import {
    evaluateTextAgainstProhibitedWords,
    ProhibitedWord,
} from "@/domain/moderation/text-moderation"

export type ModerationResult = {
    approved: boolean
    reason?: string
    category?: string
}

@Injectable()
export class ModerationService {
    constructor(
        @Inject("MODERATION_REPOSITORY")
        private readonly moderationRepository: IModerationRepository,
    ) {}

    async assertApprovedForPost(text: string) {
        return this.assertApproved(text, "Post bloqueado por moderación")
    }

    async assertApprovedForComment(text: string) {
        return this.assertApproved(text, "Comentario bloqueado por moderación")
    }

    private async assertApproved(text: string, defaultMessage: string) {
        const decision = await this.moderate(text)

        if (!decision.approved) {
            throw new BadRequestException(decision.reason ?? defaultMessage)
        }
    }

    private async getProhibitedWords(): Promise<ProhibitedWord[]> {
        const words = await this.moderationRepository.listProhibitedWords()
        return words.map((w) => ({ word: w.word, category: w.category }))
    }

    async moderate(text: string): Promise<ModerationResult> {
        const prohibitedWords = await this.getProhibitedWords()
        return evaluateTextAgainstProhibitedWords(text, prohibitedWords)
    }

    findAll() {
        return this.moderationRepository.listProhibitedWords()
    }

    create(word: string, category: string) {
        return this.moderationRepository.createProhibitedWord(word, category)
    }

    async delete(id: string) {
        const deleted =
            await this.moderationRepository.deleteProhibitedWordById(id)

        if (!deleted) {
            throw new NotFoundException("Palabra prohibida no encontrada")
        }

        return deleted
    }
}
