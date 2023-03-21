import boto3
from boto3.dynamodb.conditions import Key
import urllib.request
import json

# add your get-notes function here
def lambda_handler(event, context):
    access_token = event["headers"]["access_token"]
    
    resource = urllib.request.urlopen(f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}')
    content =  resource.read().decode(resource.headers.get_content_charset())
    data = json.loads(content)
    is_verified = data["email_verified"]
    token_email = data["email"]

    if is_verified:
        email = event["queryStringParameters"]["email"]
        correct_email = (token_email == email)

    if is_verified and correct_email:
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