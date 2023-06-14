import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const parameter = new ssm.StringParameter(this, "TableNameParameter", {
      parameterName: "/powertooldemo/tablename",
      stringValue: table.tableName,
    });

    const lambdaRuby = new lambda.Function(this, "LambdaRuby", {
      runtime: lambda.Runtime.RUBY_2_7,
      code: lambda.Code.fromAsset("../ruby_demo"),
      memorySize: 256,
      handler: "function.lambda_handler",
      timeout: cdk.Duration.seconds(15)
    });

    new cdk.CfnOutput(this, "FunctionName", {
      exportName: "FunctionNameRuby",
      value: lambdaRuby.functionName,
    });

    new cdk.CfnOutput(this, "TableName", {
      exportName: "TableName",
      value: table.tableName,
    });

    parameter.grantRead(lambdaRuby);
    table.grantReadWriteData(lambdaRuby);

    table.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    parameter.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    lambdaRuby.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
