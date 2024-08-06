# Frontend

## Requirements

get ApiGateway URL from Backend and put into src/services/api.js

Request acces to Amazon Bedrock Model Claude 3 Sonnet

## Install

```bash
npm install

URL_API=$(aws cloudformation describe-stacks --stack-name  exam-correction --query "Stacks[0].Outputs[?OutputKey=='ExamsApi'].OutputValue" --output text)
cat ../frontend/src/services/api_template.js | sed -e "s|API_GATEWAY_URL|$URL_API|" > ../frontend/src/services/api.js
```

## Run local

```bash
npm start
```

## Build

```bash
npm run build
```

## Deploy

```bash
aws cloudformation create-stack --stack-name exam-frontend --template-body file://template.yaml
aws cloudformation wait stack-create-complete --stack-name exam-frontend
bucket_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
cloudfront_id=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`CFDistributionID`].OutputValue' --output text)
cloudfront_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`CFDistributionName`].OutputValue' --output text)

aws s3 sync ./build s3://$bucket_name
aws cloudfront create-invalidation --distribution-id $cloudfront_id --paths "/*"
echo $cloudfront_name
```

## Delete

```bash
aws s3 rm s3://$bucket_name --recursive
aws cloudformation delete-stack --stack-name exam-frontend
aws cloudformation wait stack-delete-complete --stack-name exam-frontend
```
