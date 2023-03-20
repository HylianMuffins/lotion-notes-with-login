import boto3
# add your save-note function here
def lambda_handler(event, context):
    return {
        "statusCode": 401,
        "message": "Unauthenticated request has been made"
    }