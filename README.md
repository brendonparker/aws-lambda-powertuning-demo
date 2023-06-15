# Demo of AWS Lambda Power Tuning

## To deploy sample lambads:
```
dotnet publish ./dotnet_demo -c Release -o ./dotnet_demo/dist
cd iac
npm install -g aws-cdk@2.73.0
yarn install
cdk deploy
```

## To verify lambdas are working
```
aws lambda invoke --cli-binary-format raw-in-base64-out --function-name NODE_FUNCTION_NAME --payload "{\"message\":\"Hello World\"}" response.json
aws lambda invoke --cli-binary-format raw-in-base64-out --function-name NODE_FUNCTION_NAME --payload "{\"message\":\"Hello World\"}" response.json

aws dynamodb scan --table-name TABLE_NAME
```

## Using Power Tuning

Pretty well documented here: https://github.com/alexcasalboni/aws-lambda-power-tuning

But install using SAR: https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:451282441545:applications~aws-lambda-power-tuning

- Then go to Step Functions within AWS Console. 
- Open the state machine.
- Click "Start Execution"
- Use the following payload/input:

```
{
    "lambdaARN": "arn:aws:lambda:us-east-1:ACCOUNT:function:AppStack-LambdaRubyBLAH-BLAH",
    "powerValues": [256, 512, 1024, 1536, 2048, 3008],
    "num": 10,
    "payload": { "message": "Testing with Power Tuning" },
    "parallelInvocation": false,
    "strategy": "balanced"
}
```

- Once complete, go to "Execution input and output"
- Under output, copy the url for `visualization` and copy/visit the url

## Sample results

| Runtime | Cold/Warm | Results |
|:-----:|:----:|----|
| ruby | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;q6qMQgAA7EGrqtpBq6rqQQAA+EFVVd1B;TBggNJ5KBzRJi3w0nkoHNaizUTVJi3w1) |
| ruby | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;VVX9QQAAAEEAAPBAAAAIQVVVFUEAAAhB;l0+QM5dPEDOXT5AzilkiNJ5KhzSKWaI0) |
| nodejs | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;AOAZRFUVpkNVVRlDVVW+QgAAmkJVVZpC;wp+tNYi3uzXCn601Y3fYNdE3AjYA4S82) |
| nodejs | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;q6qQQgAAHEJVVdVBVVXxQVVV1UGrqsJB;yJokNADhLzRPhnM0Gs0LNbukNjVcfGE1) |
| dotnet | COLD | [Results](https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;VfWlRKuKHURVFZxDVVVVQwCAQ0MAADdD;OCe7NhfasTZQcbA2zfO0NuD53DYQhBc3) |
| dotnet | WARM | [Results](https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;AACIQQAA8ECrqgpBAAAIQauqAkGrqupA;kVSZM5dPkDOKWSI0T4ZzNIpZojTm9NM0) |
| Both | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;AOAZRFUVpkNVVRlDVVW+QgAAmkJVVZpC;wp+tNYi3uzXCn601Y3fYNdE3AjYA4S82;gAAAAQACAAQABgAI;q6qMQgAA7EGrqtpBq6rqQQAA+EFVVd1B;TBggNJ5KBzRJi3w0nkoHNaizUTVJi3w1;nodejs%20(cold);ruby%20(cold)) |
| Both | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAI;q6qQQgAAHEJVVdVBVVXxQVVV1UGrqsJB;yJokNADhLzRPhnM0Gs0LNbukNjVcfGE1;gAAAAQACAAQABgAI;VVX9QQAAAEEAAPBAAAAIQVVVFUEAAAhB;l0+QM5dPEDOXT5AzilkiNJ5KhzSKWaI0;nodejs%20(warm);ruby%20(warm)) |