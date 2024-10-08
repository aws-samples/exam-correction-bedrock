#!/bin/bash
FOLDER=Desktop/provas
BUCKET=$(aws cloudformation describe-stacks --stack-name exam-correction --query 'Stacks[0].Outputs[?OutputKey==`ExamsBucket`].OutputValue' --output text)

# Every 5 seconds
while true; do
    # check folder
    echo ===Veryfing exam folder===
    # get the current time
    current_time=$(date +"%T")
    echo "Current Time: $current_time"
    # list folder
    echo ===Exams===
    ls ~/$FOLDER
    echo ===Syncing with S3===
    aws s3 sync ~/$FOLDER s3://$BUCKET --exclude ".*" --exclude "*/.*"
    # sleep for 5 seconds
    sleep 5
done
