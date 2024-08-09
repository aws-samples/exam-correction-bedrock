import os
import json
import random
import boto3
from botocore.config import Config

BUCKET = os.environ["BUCKET_NAME"]

my_config = Config(
    signature_version = 's3v4',
    s3={'addressing_style': 'path'},
)
s3 = boto3.client('s3', config=my_config)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    file_name = f"{random.randint(1, 100000000)}{body['file_name']}"
    

    content_type = 'image/jpeg'
    if file_name.endswith('.png'):
        content_type = 'image/png'

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': BUCKET,
            'Key': file_name,
            'ContentType': content_type
        },
        ExpiresIn=3600,
        HttpMethod='PUT'
    )

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
        },
        'body': json.dumps({
            'presigned_url': presigned_url
        })
    }
