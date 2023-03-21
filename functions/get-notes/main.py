import boto3
from boto3.dynamodb.conditions import Key
# add your get-notes function here
def lambda_handler(event, context):
    # Comeback to this later
    if True:
        email = event["headers"]["email"]
        
        notes = get_notes(email)

        return notes
    else:
        return {
            "statusCode": 401,
            "message": "Unauthenticated request has been made"
        }

def get_notes(email):
    # Create dynamodb resource
    dynamodb_resource = boto3.resource("dynamodb")
    # Create a dynamodb table object
    table = dynamodb_resource.Table("lotion-30142889")

    # Get notes of only the specific email
    response = table.query(KeyConditionExpression = Key("email").eq(email))
    notes = response["Items"]

    return notes