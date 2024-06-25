# Skill

## Build & Deploy

```bash
sam validate
sam build
sam deploy --parameter-overrides SkillID=amzn1.ask.skill.54e06627-31b7-435c-8a02-c683f3df2cf8 TableName=163701031472-us-east-1-exam-correction-exams --stack-name skill-exam-correction --resolve-s3 --resolve-image-repos --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM --no-confirm-changeset
```

## Delete

```bash
sam delete --stack-name skill-exam-correction
```
