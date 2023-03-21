import boto3
from boto3.dynamodb.conditions import Key
import urllib.request
import json
# add your save-note function here
def lambda_handler(event, context):
    access_token = event["headers"]["access_token"]
    
    print(event)
    resource = urllib.request.urlopen(f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}')
    content =  resource.read().decode(resource.headers.get_content_charset())
    data = json.loads(content)
    is_verified = data["email_verified"]

    if is_verified:
        email = event["headers"]["email"]
        print(event)
        note = '{"id": "0b6751d2-33f4-4c42-8243-150008869add", "title": "Untitled", "date": "2023-03-21T14:37", "text": ""}'
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
