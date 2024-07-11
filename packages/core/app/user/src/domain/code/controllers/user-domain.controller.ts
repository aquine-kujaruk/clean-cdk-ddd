import { User } from "../entities/user.entity";
import { BaseController } from '@packages/shared/app/src/infraestructure/controllers/base.controller';

export class UserDomainController extends BaseController {
    static create(data: Record<string, any>) {
        return User.fromJson(data);
    }
}