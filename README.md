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
| ruby | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6qMQlVVAUIAAOhBq6raQauq3kFVVd1Bq6rqQQ==;TBggNBTSFDQhyII0SYv8NHZoPTVJi3w1mLXGNQ==) |
| ruby | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6rSQauqIkEAABhBq6oKQauqIkEAABhBq6oqQQ==;T4ZzM3BtRjN9Y7QzilkiNBTSlDR9Y7Q0XrgRNQ==) |
| nodejs | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;AEAtRKtqlEOrqhVDq6qxQquqq0IAAJJCAACRQg==;ulPDNVZspzVFHak1rq7INTZwETbImiQ2VsNxNg==) |
| nodejs | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6pqQquq+kGrqrZBVVXNQVVVzUGrqspBq6qqQQ==;XwkFNJdPEDRpck80VoHqNADhLzVWgWo1XriRNQ==) |
| dotnet | COLD | [Results](https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;VfWlRKuKHURVFZxDVVVVQwCAQ0MAADdD;OCe7NhfasTZQcbA2zfO0NuD53DYQhBc3) |
| dotnet | WARM | [Results](https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;AACIQQAA8ECrqgpBAAAIQauqAkGrqupA;kVSZM5dPkDOKWSI0T4ZzNIpZojTm9NM0) |
| ruby/node | COLD | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6qMQlVVAUIAAOhBq6raQauq3kFVVd1Bq6rqQQ==;TBggNBTSFDQhyII0SYv8NHZoPTVJi3w1mLXGNQ==;gAAAAQACAAQABgAIwAs=;AEAtRKtqlEOrqhVDq6qxQquqq0IAAJJCAACRQg==;ulPDNVZspzVFHak1rq7INTZwETbImiQ2VsNxNg==;ruby;nodejs) |
| ruby/node | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6rSQauqIkEAABhBq6oKQauqIkEAABhBq6oqQQ==;T4ZzM3BtRjN9Y7QzilkiNBTSlDR9Y7Q0XrgRNQ==;gAAAAQACAAQABgAIwAs=;q6pqQquq+kGrqrZBVVXNQVVVzUGrqspBq6qqQQ==;XwkFNJdPEDRpck80VoHqNADhLzVWgWo1XriRNQ==;ruby;nodejs) |
| dotnet/node | COLD | [Results](https://lambda-power-tuning.show/#AAEAAgAEAAYACMAL;VfWlRKuKHURVFZxDVVVVQwCAQ0MAADdD;OCe7NhfasTZQcbA2zfO0NuD53DYQhBc3;gAAAAQACAAQABgAIwAs=;AEAtRKtqlEOrqhVDq6qxQquqq0IAAJJCAACRQg==;ulPDNVZspzVFHak1rq7INTZwETbImiQ2VsNxNg==;dotnet;nodejs) |
| dotnet/node | WARM | [Results](https://lambda-power-tuning.show/#gAAAAQACAAQABgAIwAs=;q6pqQquq+kGrqrZBVVXNQVVVzUGrqspBq6qqQQ==;XwkFNJdPEDRpck80VoHqNADhLzVWgWo1XriRNQ==;AAEAAgAEAAYACMAL;AACIQQAA8ECrqgpBAAAIQauqAkGrqupA;kVSZM5dPkDOKWSI0T4ZzNIpZojTm9NM0;nodejs;dotnet) |