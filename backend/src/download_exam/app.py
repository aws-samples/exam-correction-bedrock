import os
import json
import boto3

BUCKET = os.environ["BUCKET_NAME"]
s3 = boto3.client('s3')

def lambda_handler(event, context):
    file_name = event['pathParameters']['filename'].replace("%20", " ")

    presigned_url = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': BUCKET,
            'Key': file_name
        },
        ExpiresIn=3600,
        HttpMethod='GET'
    )

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        },
        'body': json.dumps({
            'presigned_url': presigned_url
        })
    }