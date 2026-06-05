import { Injectable } from "@nestjs/common"

import {
    CommentRecord,
    ICommentRepository,
} from "@/domain/repositories/comment.repository"
import { CreateCommentDto } from "@/posts/posts.dtos"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
    constructor(private readonly prisma: PrismaService) {}

    findManyByPostId(postId: string): Promise<CommentRecord[]> {
        return this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
        })
    }

    createForPost(postId: string, data: CreateCommentDto): Promise<CommentRecord> {
        return this.prisma.comment.create({
            data: {
                postId,
                content: data.content,
                source: "comments-module",
            },
        })
    }
}
