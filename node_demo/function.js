const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const getTableName = (function () {
  let TABLE_NAME = "";
  return async function () {
    if (!TABLE_NAME) {
      const tableResponse = await ssm
        .getParameter({ Name: "/powertooldemo/tablename" })
        .promise();
      TABLE_NAME = tableResponse.Parameter.Value;
    }
    return TABLE_NAME;
  };
})();

exports.lambda_handler = async (event, context) => {
  try {
    const item = {
      id: new Date().toISOString(), // Generate a unique ID for the item
      message: event.message,
      source: 'Node'
    };

    const putParams = {
      TableName: await getTableName(),
      Item: item,
    };

    await dynamodb.put(putParams).promise();
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
