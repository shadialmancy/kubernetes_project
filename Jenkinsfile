pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t shadialmancy/web_application:v10'
            }
        }
        stage('Push') {
            steps {
                sh 'docker push shadialmancy/web_application:v10'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f nodeDeployment.yaml'
            }
        }
    }
}