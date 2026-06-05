export type ProhibitedWordRecord = {
    id: string
    word: string
    category: string
    createdAt: Date
}

export interface IModerationRepository {
    listProhibitedWords(): Promise<ProhibitedWordRecord[]>
    createProhibitedWord(word: string, category: string): Promise<ProhibitedWordRecord>
    deleteProhibitedWordById(id: string): Promise<ProhibitedWordRecord | null>
}
