# Demo of AWS Lambda Power Tuning

## To deploy sample lambads:
```
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

Here are sample reports:

- Ruby cold starts: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;q6oMQquq8kEAANhBq6riQauq6kFVVelB;ilkiNBrNizRPhvM0MixENZ5KhzWYtcY1
- Ruby warm starts: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;q6oaQauqEkGrqhJBAAAQQauqEkEAABBB;fWM0M31jtDN9YzQ0T4ZzNH1jtDSDc+40
- Node cold starts: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;q2rTQwAAX0OrKh1DVVXqQlVV10IAAMlC;g3PuNalq+zU/IjI2D45HNk+GczY+P6c2
- Node warm starts: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;AAAiQgAA8EEAAMhBAADUQVVV0UGrqtZB;+uU4NJ5KhzRcfOE0u6Q2NU+GczWi1rI1

- Ruby vs Node Cold Start: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;q6oMQquq8kEAANhBq6riQauq6kFVVelB;ilkiNBrNizRPhvM0MixENZ5KhzWYtcY1;AAEAAgAEAAYACMAL;q2rTQwAAX0OrKh1DVVXqQlVV10IAAMlC;g3PuNalq+zU/IjI2D45HNk+GczY+P6c2;Ruby%20Cold%20Start;Node%20Cold%20Sart
- Ruby vs Node Warm Start: https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;q6oaQauqEkGrqhJBAAAQQauqEkEAABBB;fWM0M31jtDN9YzQ0T4ZzNH1jtDSDc+40;AAEAAgAEAAYACMAL;AAAiQgAA8EEAAMhBAADUQVVV0UGrqtZB;+uU4NJ5KhzRcfOE0u6Q2NU+GczWi1rI1;Ruby%20Warm%20Start;Node%20Warm%20Start