import { Book } from "../../../domain/src/entities/book.entity";
import { BaseService } from '@modules/shared/app/src/infraestructure/services/base.service';

export class BookDomainService extends BaseService {
    static create(data: Record<string, any>) {
        return Book.fromJson(data);
    }
}