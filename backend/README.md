# Backend

# Requirements

Python3

# Valid AWS Credentias

use aws configure or export valid AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

## Build & Deploy

```bash

DEPLOY_REGION=us-east-1 #or can be changed to another AWS Region
sam validate
sam build
sam deploy --region $DEPLOY_REGION --stack-name exam-correction --resolve-s3 --resolve-image-repos --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM --no-confirm-changeset --parameter-overrides PythonVersion=`python3 --version | sed 's/ //g' | cut -d '.' -f 1,2 | tr '[:upper:]' '[:lower:]'`
```

## Delete

```bash
sam delete --stack-name exam-correction
```
