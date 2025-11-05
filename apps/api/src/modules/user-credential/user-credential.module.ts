import { Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserCredentialEntity } from '@database/entities';

@Module({
  imports: [MikroOrmModule.forFeature([UserCredentialEntity])],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
