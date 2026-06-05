import {
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import {
    ICommentRepository,
} from "@/domain/repositories/comment.repository"
import { IPostRepository } from "@/domain/repositories/post.repository"
import { CreateCommentDto } from "@/posts/posts.dtos"
import { ModerationService } from "@/moderation/moderation.service"

@Injectable()
export class CommentsService {
    constructor(
        @Inject("COMMENT_REPOSITORY")
        private readonly commentsRepository: ICommentRepository,
        @Inject("POST_REPOSITORY")
        private readonly postsRepository: IPostRepository,
        private readonly moderationService: ModerationService,
    ) {}

    async listByPostId(postId: string) {
        await this.assertPostExists(postId)

        const comments = await this.commentsRepository.findManyByPostId(postId)

        return {
            total_comments: comments.length,
            comments,
        }
    }

    async create(postId: string, data: CreateCommentDto) {
        await this.assertPostExists(postId)

        await this.moderationService.assertApprovedForComment(data.content)

        return this.commentsRepository.createForPost(postId, data)
    }

    private async assertPostExists(postId: string) {
        const post = await this.postsRepository.findById(postId)
        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }
    }
}
