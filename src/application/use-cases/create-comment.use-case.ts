import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { PostRepository } from "@/domain/repositories/post.repository"
import { CommentRepository } from "@/domain/repositories/comment.repository"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { ModerationDomainService } from "@/domain/services/moderation-domain.service"
import { CreateCommentDto } from "@/posts/posts.dtos"

@Injectable()
export class CreateCommentUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
        private readonly moderationRepository: ModerationRepository,
        private readonly moderationDomainService: ModerationDomainService,
    ) {}

    async execute(postId: string, data: CreateCommentDto) {
        const post = await this.postRepository.findById(postId)

        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }

        const prohibitedWords =
            await this.moderationRepository.findAllProhibitedWords()

        const moderation = this.moderationDomainService.moderate(
            data.content,
            prohibitedWords,
        )

        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Comentario bloqueado por moderación",
            )
        }

        return this.commentRepository.create({
            postId,
            content: data.content,
            source: "comments-module",
        })
    }
}
