import { BadRequestException, Injectable } from "@nestjs/common"
import { PostRepository } from "@/domain/repositories/post.repository"
import { ModerationRepository } from "@/domain/repositories/moderation.repository"
import { ModerationDomainService } from "@/domain/services/moderation-domain.service"
import { CreatePostDto } from "@/posts/posts.dtos"

@Injectable()
export class CreatePostUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly moderationRepository: ModerationRepository,
        private readonly moderationDomainService: ModerationDomainService,
    ) {}

    async execute(data: CreatePostDto) {
        const text = `${data.title} ${data.description}`

        const prohibitedWords =
            await this.moderationRepository.findAllProhibitedWords()

        const moderation = this.moderationDomainService.moderate(
            text,
            prohibitedWords,
        )

        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Post bloqueado por moderación",
            )
        }

        return await this.postRepository.create(data)
    }
}
