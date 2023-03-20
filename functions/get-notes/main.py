import boto3
# add your get-notes function here
def lambda_handler(event, context):
    # Comeback to this later
    if event["queryStringParameters"]["email"] == event["queryStringParameters"]["access_token"]:
        notes = get_notes(event["queryStringParameters"]["email"])
        
        return {
            "statusCode": 200,
            "notes": notes,
        }
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
    response = table.query(Key = {"email": email})
    notes = response["Items"]

    return notes