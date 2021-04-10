#!/bin/bash

### Arguments
# 1 - s3 uri for registered model
# 2 - docker image name / ecr repo name
# 3 - ecr url (may be able to get from create-repository output)
# 4 - ecr region (us-east-1)

echo "Authenticating docker with AWS"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $3
echo "Building docker image from given s3 uri: "
echo $1
echo "name: "
echo $2
echo "ecr URL: "
echo $3
mlflow models build-docker -m $1 -n $2
echo "Creating ECR repo for image"
aws ecr create-repository --repository-name $2 --region $4
echo "Tagging docker image:"
docker tag $2:latest $3/$2:latest
echo "Pushing docker image:"
docker push $3/$2:latest
echo "Push successful"
echo "Image exists at:"
echo $3/$2:latest