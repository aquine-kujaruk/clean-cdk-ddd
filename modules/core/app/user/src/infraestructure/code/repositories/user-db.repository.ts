import { AwsDynamoDbAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { User } from '../../../domain/code/entities/user.entity';
import { UserRepository } from '../../../domain/code/repositories/user.repository';

export class UserDbRepository implements UserRepository {
  async save(user: User) {
    await AwsDynamoDbAdapter.upsertItem({
      TableName: process.env.USER_TABLE_NAME,
      Item: user,
    });
  }
}
