import { Controller } from '@nestjs/common';
import { ToiletService } from './toilet.service';

@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}
}
