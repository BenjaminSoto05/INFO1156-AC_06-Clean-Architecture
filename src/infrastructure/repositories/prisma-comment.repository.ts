import { Injectable } from "@nestjs/common"
import {
    CommentEntity,
    CommentRepository,
    CreateCommentData,
} from "@/domain/repositories/comment.repository"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaCommentRepository extends CommentRepository {
    constructor(private readonly prisma: PrismaService) {
        super()
    }

    async create(data: CreateCommentData): Promise<CommentEntity> {
        return this.prisma.comment.create({ data })
    }

    async findByPostId(postId: string): Promise<CommentEntity[]> {
        return this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
        })
    }
}
