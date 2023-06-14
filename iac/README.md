# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

Once deployed, you can invoke the lambda and check the results using these commands:
```
aws lambda invoke --cli-binary-format raw-in-base64-out --function-name FUNCTION_NAME --payload "{\"message\":\"Hello World\"}" response.json

aws dynamodb scan --table-name TABLE_NAME
```