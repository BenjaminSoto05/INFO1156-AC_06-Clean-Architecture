import { BadRequestException, Injectable } from "@nestjs/common"
import { CreatePostDto } from "@/posts/posts.dtos"
import { ModerationService } from "@/moderation/moderation.service"
import { PostRepository } from "@/domain/repositories/post.repository"
import { Post } from "@/domain/entities/post.entity"

@Injectable()
export class CreatePostUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly moderationService: ModerationService,
    ) {}

    async execute(data: CreatePostDto): Promise<Post> {
        const text = `${data.title} ${data.description}`
        const moderation = await this.moderationService.moderate(text)

        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Post bloqueado por moderación",
            )
        }

        return this.postRepository.create(data)
    }
}
