pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''#!/bin/bash
IMAGE_NAME="sephyz/idevops:${BUILD_NUMBER}"
docker build . -t $IMAGE_NAME
docker login -u ${DOCKER_HUB_U} -p ${DOCKER_HUB_P}
docker push $IMAGE_NAME'''
      }
    }
    stage('Deploy') {
      steps {
        sh '''#!/bin/bash
IMAGE_NAME="sephyz/idevops:${BUILD_NUMBER}"
kubectl set image deployment/idevops idevops=$IMAGE_NAME'''
      }
    }
  }
}