# Backend

## Build & Deploy

```bash
sam validate
sam build
sam deploy --stack-name exam-correction --resolve-s3 --resolve-image-repos --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM --no-confirm-changeset
```

## Delete

```bash
sam delete --stack-name exam-correction
```
