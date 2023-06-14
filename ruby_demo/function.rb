require 'aws-sdk-ssm'
require 'aws-sdk-dynamodb'

$table_name = Aws::SSM::Client.new().get_parameter(name: '/powertooldemo/tablename', with_decryption: true).parameter.value

def lambda_handler(event:, context:)
  # Configure AWS DynamoDB client
  dynamodb = Aws::DynamoDB::Client.new()

  # Get the input string from the event
  message = event['message']

  # Create a new item to be inserted into DynamoDB
  item = {
    'id' => SecureRandom.uuid,  # Generate a unique ID for the item
    'message' => message
  }

  # Specify the parameters for the DynamoDB PutItem operation
  put_item_params = {
    table_name: $table_name,
    item: item
  }

  # Insert the item into DynamoDB
  begin
    dynamodb.put_item(put_item_params)
    puts "Successfully inserted item into DynamoDB"
  rescue StandardError => e
    puts "Error inserting item into DynamoDB: #{e.message}"
  end
end
