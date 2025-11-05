import { Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserCredentialEntity } from '@database/entities';
import { UserCredentialRepository } from '@modules/user-credential/user-credential.repository';

@Module({
  imports: [MikroOrmModule.forFeature([UserCredentialEntity])],
  providers: [UserCredentialService, UserCredentialRepository],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
