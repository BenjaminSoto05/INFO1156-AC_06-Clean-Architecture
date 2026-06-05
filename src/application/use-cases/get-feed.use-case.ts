import { Injectable } from "@nestjs/common"
import { FeedMode, FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { PostRepository } from "@/domain/repositories/post.repository"
import { FeedPost } from "@/domain/entities/post.entity"

@Injectable()
export class GetFeedUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly feedRankingFactory: FeedRankingStrategyFactory,
    ) {}

    async execute(mode: FeedMode, categoryId?: string): Promise<FeedPost[]> {
        const feedPosts = await this.postRepository.findFeedItems(categoryId)
        return this.feedRankingFactory.forMode(mode).rank(feedPosts)
    }
}
