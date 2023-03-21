import boto3
from boto3.dynamodb.conditions import Key
import urllib.request
import json
# add your save-note function here
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
        body = json.loads(event["body"])

        notes = save_note(email, body)

        return notes
    else:
        return {
            "statusCode": 401,
            "message": "Unauthenticated request has been made"
        }
    
def save_note(email, body):
    # Create dynamodb resource
    dynamodb_resource = boto3.resource("dynamodb")
    # Create a dynamodb table object
    table = dynamodb_resource.Table("lotion-30142889")

    response = table.get_item(
        Key = {
            "email": email,
            "id": body["id"]
        }
    )


    table.update_item(
        Key = {
            "email": email,
            "id": body["id"]
        },
        UpdateExpression="SET title = :title, noteDate = :when, content = :text",
        ExpressionAttributeValues = {":title": body["title"], ":when": body["date"], ":text": body["text"]}
    )
