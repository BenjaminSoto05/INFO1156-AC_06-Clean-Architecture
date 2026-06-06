import { Injectable } from "@nestjs/common"
import { FeedPost } from "@/domain/entities/post.entity"

export type FeedMode = "latest" | "mostLiked" | "mostCommented" | "relevance"

export interface FeedRankingStrategy {
    rank(posts: FeedPost[]): FeedPost[]
}

@Injectable()
export class LatestRankingStrategy implements FeedRankingStrategy {
    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )
    }
}

@Injectable()
export class MostLikedRankingStrategy implements FeedRankingStrategy {
    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.likesCount - a.likesCount)
    }
}

@Injectable()
export class MostCommentedRankingStrategy implements FeedRankingStrategy {
    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.commentsCount - a.commentsCount)
    }
}

@Injectable()
export class RelevanceRankingStrategy implements FeedRankingStrategy {
    rank(posts: FeedPost[]): FeedPost[] {
        return [...posts].sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
}

@Injectable()
export class FeedRankingStrategyFactory {
    private readonly strategies = new Map<FeedMode, FeedRankingStrategy>()

    constructor() {
        this.register("latest", new LatestRankingStrategy())
        this.register("mostLiked", new MostLikedRankingStrategy())
        this.register("mostCommented", new MostCommentedRankingStrategy())
        this.register("relevance", new RelevanceRankingStrategy())
    }

    register(mode: FeedMode, strategy: FeedRankingStrategy): void {
        this.strategies.set(mode, strategy)
    }

    forMode(mode: FeedMode): FeedRankingStrategy {
        const strategy = this.strategies.get(mode)

        if (!strategy) {
            return this.strategies.get("latest")!
        }

        return strategy
    }
}
