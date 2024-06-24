import os
import json
import boto3

dynamodb = boto3.resource('dynamodb')
TABLE = os.environ["TABLE_NAME"]

def lambda_handler(event, context):
    items = dynamodb.Table(TABLE).scan()

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        },
        "body": json.dumps(
            {
                "results": items,
            }
        ),
    }