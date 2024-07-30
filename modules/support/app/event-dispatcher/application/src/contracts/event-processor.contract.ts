import { ControllerClassType } from '@modules/shared/app//infraestructure/src/controllers/base.controller';
import { HandlerProps } from '@modules/shared/app/infraestructure/src/lambda-handler.router';

export type InvokeHandlerPayload = Omit<HandlerProps, 'controller'> & {
  controller: ControllerClassType;
};

export interface IEventProcessorRepository {
  invokeHandler(target: string, payload: InvokeHandlerPayload): Promise<void>;

  invokeUseCase(target: string, payload: { body: Record<string, any> }): Promise<void>;
}
