export type ProhibitedWord = {
    word: string
    category?: string
}

export type ModerationDecision = {
    approved: boolean
    reason?: string
    category?: string
}

export const buildFuzzyRegex = (word: string) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(escaped.split("").join("[^a-zA-Z0-9]*"), "gi")
}

export const evaluateTextAgainstProhibitedWords = (
    text: string,
    prohibitedWords: ProhibitedWord[],
): ModerationDecision => {
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
