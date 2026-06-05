export type ProhibitedWordEntity = {
    id: string
    word: string
    category: string
    createdAt: Date
}

export abstract class ModerationRepository {
    abstract findAllProhibitedWords(): Promise<ProhibitedWordEntity[]>
}
