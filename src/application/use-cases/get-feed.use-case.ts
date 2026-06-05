import { Injectable } from "@nestjs/common"
import { FeedMode, FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { PostRepository } from "@/domain/repositories/post.repository"
import { FeedPost } from "@/domain/entities/post.entity"
import { FeedPostMapper } from "@/domain/mappers/feed-post.mapper"

@Injectable()
export class GetFeedUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly feedRankingFactory: FeedRankingStrategyFactory,
        private readonly feedPostMapper: FeedPostMapper,
    ) {}

    async execute(mode: FeedMode, categoryId?: string): Promise<FeedPost[]> {
        const rawPosts = await this.postRepository.findFeedItems(categoryId)
        const feedPosts = this.feedPostMapper.toFeedPosts(rawPosts)
        return this.feedRankingFactory.forMode(mode).rank(feedPosts)
    }
}

