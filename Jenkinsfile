pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'  
        FRONTEND_TAG = 'v10'
        BACKEND_TAG = 'backend'
        DOCKERHUB_USERNAME = 'shadialmancy'            
        DOCKERHUB_REPOSITORY = 'web_application'   
        KUBECONFIG = '/home/jenkins/.kube/config'           
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
                        sh 'docker login -u shadialmancy -p Almancy@190'    
                        docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}")
                        sh 'docker push shadialmancy/web_application:v10'
                        // withCredentials([string(credentialsId: 'dockerhub-pwd2', variable: 'dockerhub-pwd'), string(credentialsId: 'dockerhubusername', variable: 'dockerhub-username')]) {
                            
                        //     docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                        //     docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
                        //     }
                        // }   
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
                export KUBECONFIG=/home/jenkins/.kube/config
                kubectl apply -f ./nodeDeployment.yaml
                kubectl apply -f ./mongo-k8s.yml
                kubectl apply -f ./presistent_volume_claim.yml
                kubectl apply -f ./presistent_volume.yml
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

