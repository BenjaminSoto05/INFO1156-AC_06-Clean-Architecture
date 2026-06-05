export type ProhibitedWord = {
    id: string
    word: string
    category: string
    createdAt: Date
}

export type ModerationResult = {
    approved: boolean
    reason?: string
    category?: string
}
