import { StepFunctionsIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { StateMachineConstructType } from '../../construct.types';
import { RestApiIntegrationProps, RestApiRequestIntegrationsProps } from '../rest-api.types';
import { BaseIntegration } from './base.integration';

class StateMachineIntegration extends BaseIntegration {
  private constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestIntegrationsProps
  ) {
    super(scope, props);

    const handler = (this.props.target as any).getImportedResource(this.scope);

    const integration = StepFunctionsIntegration.startExecution(handler, {
      useDefaultMethodResponses: true,
    });

    super.addMethod(integration);
  }

  static setup(
    requestProps: RestApiRequestIntegrationsProps & { target: StateMachineConstructType }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new StateMachineIntegration(scope, { ...props, ...requestProps });
  }
}

export default StateMachineIntegration.setup;
