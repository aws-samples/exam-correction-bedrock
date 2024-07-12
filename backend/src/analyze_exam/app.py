from urllib.parse import unquote_plus
import os
import json
import base64
import random
import datetime
import boto3

TABLE = os.environ["TABLE_NAME"]
BUCKET = os.environ["BUCKET_NAME"]
MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"
PROMPT = "Corrigir a seguinte redação de acordo com os critérios de avaliação do ENEM: [Redação]. Forneça feedback detalhado sobre a competência de cada critério (Competência 1: Demonstrar domínio da modalidade escrita formal da língua portuguesa, Competência 2: Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa, Competência 3: Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista, Competência 4: Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação, Competência 5: Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos). A pontuação atribuída a cada competência pode variar até 200 pontos. A nota máxima da redação é de mil pontos.:"

s3 = boto3.client('s3')
bedrock_client = boto3.client("bedrock-runtime")
dynamodb = boto3.resource("dynamodb")

def correct_exam():
    pass

def lambda_handler(event, context):
    # Get exam image
    examKey = event['Records'][0]['s3']['object']['key']
    examKey = unquote_plus(examKey)

    exam = s3.get_object(
        Bucket= BUCKET, 
        Key= examKey
    )
    b64 = base64.b64encode(exam['Body'].read())

    # Generate correction
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "temperature": 0,
        "messages": [
            { 
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": PROMPT, 
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": b64.decode('utf-8'),
                        },
                    },
                ]
            }
        ]
    }

    response = bedrock_client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(request_body),
    )
    result = json.loads(response.get("body").read())
    correction = str(result["content"]).replace("[{'type': 'text', 'text': '", "").replace("'}]","")

    # Add metadata
    id = str(random.randint(0, 100))
    date = datetime.datetime.now().strftime("%Y-%m-%d")
    hour = datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(hours=3)
    hour = hour.strftime("%H:%M")
    

    # Save data
    table = dynamodb.Table(TABLE)
    table.put_item(
        Item={
            "id": id,
            "date": date,
            "hour": hour,
            "student": "Gabriel",
            "image": examKey,
            "grade": "Nota",
            "correction": correction
        }
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
        },
        "body": json.dumps(
            {
                "results": [],
            }
        ),
    }