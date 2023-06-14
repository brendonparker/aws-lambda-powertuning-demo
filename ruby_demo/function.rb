require 'aws-sdk-ssm'
require 'aws-sdk-dynamodb'

$dynamodb = Aws::DynamoDB::Client.new()
$ssm = Aws::SSM::Client.new()
$table_name = $ssm.get_parameter(name: '/powertooldemo/tablename', with_decryption: true).parameter.value

def lambda_handler(event:, context:)
  message = event['message']

  item = {
    'id' => SecureRandom.uuid,
    'message' => message,
    'source' => 'Ruby',
  }

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
