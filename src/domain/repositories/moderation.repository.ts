import { ProhibitedWord } from "@/domain/entities/moderation.entity"

export abstract class ModerationRepository {
    abstract findAll(): Promise<ProhibitedWord[]>
    abstract create(word: string, category: string): Promise<ProhibitedWord>
    abstract delete(id: string): Promise<ProhibitedWord>
}
