import { ControllerClassType } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { HandlerProps } from '@modules/common/app/src/infraestructure/lambda-handler.router';

export type InvokeHandlerPayload = Omit<HandlerProps, 'controller'> & {
  controller: ControllerClassType;
};

export interface IEventProcessorRepository {
  invokeHandler(target: string, payload: InvokeHandlerPayload): Promise<void>;

  invokeUseCase(target: string, payload: { body: Record<string, any> }): Promise<void>;
}
