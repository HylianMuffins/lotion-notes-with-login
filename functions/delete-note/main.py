import json
import boto3

# add your delete-note function here
def lambda_handler(event, context):
    # Comeback tot his later
    if event["queryStringParameters"]["email"] == event["queryStringParameters"]["access_token"]:
        return delete_note(event["queryStringParameters"]["email"])
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
    table.delete_item (
        Key = {
            "email": email,
            "id": id,
        }
    )