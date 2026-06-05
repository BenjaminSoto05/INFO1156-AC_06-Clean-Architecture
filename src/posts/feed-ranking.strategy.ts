import { BadRequestException, Injectable } from "@nestjs/common"

export type FeedPost = {
    createdAt: Date
    likesCount: number
    commentsCount: number
    relevanceScore: number
}

export type FeedMode = "latest" | "mostLiked" | "mostCommented" | "relevance"

export interface IFeedRankingStrategy {
    getMode(): string
    rank(posts: FeedPost[]): FeedPost[]
}

@Injectable()
export class LatestRankingStrategy implements IFeedRankingStrategy {
    getMode(): string {
        return "latest"
    }

    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )
    }
}

@Injectable()
export class MostLikedRankingStrategy implements IFeedRankingStrategy {
    getMode(): string {
        return "mostLiked"
    }

    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.likesCount - a.likesCount)
    }
}

@Injectable()
export class MostCommentedRankingStrategy implements IFeedRankingStrategy {
    getMode(): string {
        return "mostCommented"
    }

    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.commentsCount - a.commentsCount)
    }
}

@Injectable()
export class RelevanceRankingStrategy implements IFeedRankingStrategy {
    getMode(): string {
        return "relevance"
    }

    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
}

@Injectable()
export class FeedRankingStrategyFactory {
    private readonly strategiesRegistry: Map<string, IFeedRankingStrategy>

    constructor(strategies: IFeedRankingStrategy[]) {
        this.strategiesRegistry = new Map(
            strategies.map((s) => [s.getMode(), s]),
        )
    }

    forMode(mode: string): IFeedRankingStrategy {
        const strategy = this.strategiesRegistry.get(mode)
        if (!strategy) {
            throw new BadRequestException(
                `Modo de feed no válido: ${mode}. Modos disponibles: ${Array.from(
                    this.strategiesRegistry.keys(),
                ).join(", ")}`,
            )
        }
        return strategy
    }

    getAvailableModes(): string[] {
        return Array.from(this.strategiesRegistry.keys())
    }
}
