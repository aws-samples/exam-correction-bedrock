import os
import json
import urllib.parse
import boto3

BUCKET = os.environ["BUCKET_NAME"]
s3 = boto3.client('s3')

def lambda_handler(event, context):
    encoded_file_name = event['pathParameters']['filename']
    first_decode = urllib.parse.unquote(encoded_file_name)
    file_name = urllib.parse.unquote(first_decode)

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