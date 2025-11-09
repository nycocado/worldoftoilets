import { Injectable } from '@nestjs/common';
import { ReplyRepository } from '@modules/reply/reply.repository';

@Injectable()
export class ReplyService {
  constructor(private readonly replyRepository: ReplyRepository) {}
}
