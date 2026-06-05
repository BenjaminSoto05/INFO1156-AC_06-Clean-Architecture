import { Injectable } from "@nestjs/common"

import {
    ILikeRepository,
    LikeRecord,
} from "@/domain/repositories/like.repository"
import { AddLikeDto } from "@/posts/posts.dtos"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaLikeRepository implements ILikeRepository {
    constructor(private readonly prisma: PrismaService) {}

    createForPost(
        postId: string,
        data: AddLikeDto & { weight: number },
    ): Promise<LikeRecord> {
        return this.prisma.like.create({
            data: {
                postId,
                reactionType: data.reactionType ?? "like",
                weight: data.weight,
                source: "likes-module",
            },
        })
    }
}
