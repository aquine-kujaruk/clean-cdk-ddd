import { User } from '../../../domain/code/entities/user.entity';
import { DayJsRepository } from '../repositories/day-js.repository';
import { UserDbRepository } from '../repositories/user-db.repository';
import { UuidRepository } from '../repositories/uuid.repository';
import { BaseController } from '@modules/shared/app/src/infraestructure/controllers/base.controller';

export class UserInfraestructureController extends BaseController {
  static getTimestamp() {
    const dayJsRepository = new DayJsRepository();

    return dayJsRepository.getTimestamp();
  }

  static generateUuid() {
    const uuidRepository = new UuidRepository();

    return uuidRepository.generate();
  }

  static saveUser(user: User) {
    const userDbRepository = new UserDbRepository();

    return userDbRepository.save(user);
  }
}
