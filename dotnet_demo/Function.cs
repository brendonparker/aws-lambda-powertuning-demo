using System.Text.Json.Serialization;
using Amazon.DynamoDBv2;
using Amazon.Lambda.Core;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace dotnet_demo;

public class Function
{
    private readonly AmazonDynamoDBClient _db;
    private readonly Task<GetParameterResponse> _res;

    public Function()
    {
        _db = new AmazonDynamoDBClient();
        var ssm = new AmazonSimpleSystemsManagementClient();
        _res = ssm.GetParameterAsync(new() { Name = "/powertuningdemo/tablename" });
    }

    public async Task FunctionHandler(Payload payload, ILambdaContext context)
    {
        var tableName = (await _res).Parameter.Value;

        var res = await _db.PutItemAsync(new()
        {
            TableName = tableName,
            Item = new()
            {
                ["id"] = new() { S = Guid.NewGuid().ToString() },
                ["message"] = new() { S = payload.Message },
                ["source"] = new() { S = "dotnet" },
            }
        });
        
        context.Logger.LogInformation($"Status Code: {res.HttpStatusCode}");
    }
}

public sealed class Payload
{
    [JsonPropertyName("message")]
    public string Message { get; set; }
}