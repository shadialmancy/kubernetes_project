pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'v10'
        BACKEND_TAG = 'backend'
        DOCKERHUB_USERNAME = 'shadialmancy'            
        DOCKERHUB_REPOSITORY = 'web_application'   
        KUBECONFIG = '/root/.kube/config'           
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker Version') {
            steps {
                sh 'docker --version'  // Check if Docker is available
            }
        }

        stage('Build Frontend Image') {
            steps {
                
                    script {
                        docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}")
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                            docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
                        }
                    }
                
            }
        }

        // stage('Build Backend Image') {
        //     steps {
        //         dir('backend') {
        //             script {
        //                 docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}")
        //                 docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
        //                     docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${BACKEND_TAG}").push("${BACKEND_TAG}")
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Apply Kubernetes Manifests') {
            steps {
                sh '''
                set -e
                export KUBECONFIG=/root/.kube/config
                kubectl apply -f k8s/FrontendDeployment.yaml
                kubectl apply -f k8s/BackendDeployment.yaml
                kubectl apply -f k8s/nodeDeployment.yaml
                '''
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
