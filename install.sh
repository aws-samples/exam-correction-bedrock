#!/bin/bash
# Set the -e option
set -e

echo "Install project"

# Run Backend
echo "Backend"

cd backend

sam validate
sam build
sam deploy --stack-name exam-correction --resolve-s3 --resolve-image-repos --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM --no-confirm-changeset --parameter-overrides PythonVersion=`python3 --version | sed 's/ //g' | cut -d '.' -f 1,2 | tr '[:upper:]' '[:lower:]'`

echo "Frontend"

cd ../frontend/

URL_API=$(aws cloudformation describe-stacks --stack-name  exam-correction --query "Stacks[0].Outputs[?OutputKey=='ExamsApi'].OutputValue" --output text)
cat ../frontend/src/services/api_template.js | sed -e "s|API_GATEWAY_URL|$URL_API|" > ../frontend/src/services/api.js

npm install && npm run build


aws cloudformation create-stack --stack-name exam-frontend --template-body file://template.yaml
aws cloudformation wait stack-create-complete --stack-name exam-frontend
bucket_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
cloudfront_id=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`CFDistributionID`].OutputValue' --output text)
cloudfront_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`CFDistributionName`].OutputValue' --output text)

aws s3 sync ./build s3://$bucket_name
aws cloudfront create-invalidation --distribution-id $cloudfront_id --paths "/*"
echo $cloudfront_name

echo "Done!"

