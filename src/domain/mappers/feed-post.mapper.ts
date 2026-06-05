import { Injectable } from "@nestjs/common"
import { FeedPost, RawFeedPost } from "@/domain/entities/post.entity"

@Injectable()
export class FeedPostMapper {
    toFeedPost(raw: RawFeedPost): FeedPost {
        const likesCount = raw.likes.reduce(
            (sum, like) => sum + like.weight,
            0,
        )
        const commentsCount = raw.comments.length
        const relevanceScore = likesCount * 2 + commentsCount

        return {
            id: raw.id,
            title: raw.title,
            description: raw.description,
            imageUrl: raw.imageUrl,
            categoryId: raw.categoryId,
            category: raw.category,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            likesCount,
            commentsCount,
            relevanceScore,
        }
    }

    toFeedPosts(raws: RawFeedPost[]): FeedPost[] {
        return raws.map((raw) => this.toFeedPost(raw))
    }
}
