#!/bin/bash

echo "Uninstalling project"

read -p "Enter aws Region (us-east-1): " DEPLOY_REGION
if [ -z "$DEPLOY_REGION" ]
then
    DEPLOY_REGION="us-east-1"
fi

echo "Backend"

exam_bucket_name=$(aws cloudformation describe-stacks --stack-name exam-correction --query 'Stacks[0].Outputs[?OutputKey==`ExamsBucket`].OutputValue' --output text)
aws s3 rm s3://$exam_bucket_name --recursive
sam delete --region $DEPLOY_REGION --stack-name exam-correction --no-prompts

echo "Frontend"

bucket_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)

aws s3 rm s3://$bucket_name --recursive
aws cloudformation delete-stack --stack-name exam-frontend
aws cloudformation wait stack-delete-complete --stack-name exam-frontend


echo "Done!"

