require 'aws-sdk-ssm'
require 'aws-sdk-dynamodb'

def get_parameter(parameter_name)
  ssm = Aws::SSM::Client.new(region: 'us-east-1')
  response = ssm.get_parameter(name: parameter_name, with_decryption: true)
  response.parameter.value
end

def lambda_handler(event:, context:)
  # Configure AWS DynamoDB client
  dynamodb = Aws::DynamoDB::Client.new(region: 'us-east-1')

  # Get the input string from the event
  input_string = event['input_string']

  # Retrieve the table name from the SSM Parameter Store
  table_name_param = '/powertooldemo/tablename' # Specify the SSM parameter name
  table_name = get_parameter(table_name_param)

  # Check if the table name is provided
  if table_name.nil? || table_name.empty?
    return { statusCode: 500, body: "#{table_name_param} parameter is not set in SSM" }
  end

  # Create a new item to be inserted into DynamoDB
  item = {
    'id' => SecureRandom.uuid,  # Generate a unique ID for the item
    'message' => input_string
  }

  # Specify the parameters for the DynamoDB PutItem operation
  put_item_params = {
    table_name: table_name,
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
