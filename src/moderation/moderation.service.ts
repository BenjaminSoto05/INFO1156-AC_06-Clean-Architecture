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

@Injectable()
export class ModerationService {
    constructor(
        @Inject("MODERATION_REPOSITORY")
        private readonly moderationRepository: IModerationRepository,
    ) {}

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
