import json
import boto3

# add your delete-note function here
def lambda_handler(event, context):
    # Comeback tot his later
    if True:
        email = event["queryStringParameters"]["email"]
        
        return {
            "stautsCode": 200,
            "body": json.dumps({
                "method": event["requestContext"]["http"]["method"].lower(),
                "invoker": invoker

            })
        }
    else:
        return {
            "statusCode": 401,
            "message": "Unauthenticated request has been made"
        }

def delete_note(email, id):
    # Create a dynamodb resource
    dynamodb_resource = boto3.resource("dynamodb")
    # Create a dynamodb table object
    table = dynamodb_resource.Table("lotion-30142889")

    # Deletes a note using partition and sort key
    return table.delete_item (
        Key = {
            "email": email,
            "id": id,
        }
    )