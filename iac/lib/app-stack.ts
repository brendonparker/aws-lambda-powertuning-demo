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
      writeCapacity: 25
    });

    const parameter = new ssm.StringParameter(this, "TableNameParameter", {
      parameterName: "/powertuningdemo/tablename",
      stringValue: table.tableName,
    });

    const lambdaRuby = new lambda.Function(this, "LambdaRuby", {
      runtime: lambda.Runtime.RUBY_2_7,
      code: lambda.Code.fromAsset("../ruby_demo"),
      memorySize: 256,
      handler: "function.lambda_handler",
      timeout: cdk.Duration.seconds(5)
    });

    const lambdaNode = new lambda.Function(this, "LambdaNode", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../node_demo"),
      memorySize: 256,
      handler: "function.lambda_handler",
      timeout: cdk.Duration.seconds(5)
    });

    const lambdaDotnet = new lambda.Function(this, "LambdaDotnet", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../dotnet_demo/dist"),
      memorySize: 256,
      handler: "dotnet_demo::dotnet_demo.Function::FunctionHandler",
      timeout: cdk.Duration.seconds(10)
    });

    new cdk.CfnOutput(this, "FunctionNameRuby", {
      exportName: "FunctionNameRuby",
      value: lambdaRuby.functionName,
    });

    new cdk.CfnOutput(this, "FunctionNameNode", {
      exportName: "FunctionNameNode",
      value: lambdaNode.functionName,
    });

    new cdk.CfnOutput(this, "TableName", {
      exportName: "TableName",
      value: table.tableName,
    });

    parameter.grantRead(lambdaRuby);
    parameter.grantRead(lambdaNode);
    parameter.grantRead(lambdaDotnet);

    table.grantReadWriteData(lambdaRuby);
    table.grantReadWriteData(lambdaNode);
    table.grantReadWriteData(lambdaDotnet);

    table.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    parameter.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
