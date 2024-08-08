#!/bin/bash

echo "Uninstalling project"

echo "Backend"

sam delete --stack-name exam-correction

echo "Frontend"

bucket_name=$(aws cloudformation describe-stacks --stack-name exam-frontend --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)

aws s3 rm s3://$bucket_name --recursive
aws cloudformation delete-stack --stack-name exam-frontend
aws cloudformation wait stack-delete-complete --stack-name exam-frontend


echo "Done!"

