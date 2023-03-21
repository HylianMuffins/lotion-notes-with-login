import boto3
from boto3.dynamodb.conditions import Key
import urllib.request
import json

# add your delete-note function here
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
        id = event["queryStringParameters"]["id"]

        delete_note(email, id)
        return 
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