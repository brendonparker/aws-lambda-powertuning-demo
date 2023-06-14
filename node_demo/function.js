const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const dynamodb = new AWS.DynamoDB();

const getTableName = (function () {
  let TABLE_NAME = "";
  return async function () {
    if (!TABLE_NAME) {
      const tableResponse = await ssm
        .getParameter({ Name: "/powertuningdemo/tablename" })
        .promise();
      TABLE_NAME = tableResponse.Parameter.Value;
    }
    return TABLE_NAME;
  };
})();

// Maybe this helps cold start?
getTableName();

exports.lambda_handler = async (event, context) => {
  try {
    const putParams = {
      TableName: await getTableName(),
      Item: {
        id: { S: new Date().toISOString() },
        message: { S: event.message },
        source: { S: "Node" },
      },
    };

    await dynamodb.putItem(putParams).promise();
    console.log("Successfully inserted item into DynamoDB");

    return {
      statusCode: 200,
      body: "Item inserted into DynamoDB",
    };
  } catch (error) {
    console.error("Error inserting item into DynamoDB:", error);
    return {
      statusCode: 500,
      body: "Error inserting item into DynamoDB",
    };
  }
};
