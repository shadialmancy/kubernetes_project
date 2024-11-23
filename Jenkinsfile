pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'DOCKER_CRED'  
        FRONTEND_TAG = 'v10.1'
        BACKEND_TAG = 'backend'
        DOCKERHUB_USERNAME = 'shadialmancy'            
        DOCKERHUB_REPOSITORY = 'web_application'   
        KUBECONFIG = '/home/jenkins/.kube/config'
        MY_CRED = credentials('DOCKER_CRED')
    }
    stages {
        // stage('Docker_cred') {
        //     steps {
        //         echo $env.MY_CRED_USR
        //     }
        // }
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

        stage('Build Image') {
            steps {
                
                    script {
                        
                        sh 'docker'
                        docker.build("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}",".")
                        // sh 'docker push shadialmancy/web_application:v10'
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                            docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
                        }

                        // withCredentials([string(credentialsId: 'dockerhub-pwd2', variable: 'dockerhub-pwd'), string(credentialsId: 'dockerhubusername', variable: 'dockerhub-username')]) {
                        //     sh 'docker login -u ${dockerhub-username} -p ${dockerhub-pwd}'
                        //     // docker.withRegistry('', DOCKERHUB_CREDENTIALS_ID) {
                        //     // docker.image("${DOCKERHUB_USERNAME}/${DOCKERHUB_REPOSITORY}:${FRONTEND_TAG}").push("${FRONTEND_TAG}")
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

        stage('Check if Ingress Exists') {
            steps {
                script {
                    def ingressExists = sh(script: "kubectl get ingress node-app-localhost --ignore-not-found", returnStatus: true) == 0
                    if (ingressExists) {
                        echo "Ingress node-app-localhost exists. Deleting it..."
                        // Delete the Ingress if it exists
                        sh "kubectl delete ingress node-app-localhost"
                    } else {
                        echo "Ingress node-app-localhost does not exist."
                    }
                }
            }
        }
    
        stage("ingress service"){
            steps{
                sh '''
                set -e
                export KUBECONFIG=/home/jenkins/.kube/config
                kubectl create ingress node-app-localhost --class=nginx \
                --rule="node-app.localdev.me/*=node-app:80"

                kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8090:80 
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


// https://kubernetes.github.io/ingress-nginx/deploy/
// apiVersion: kind.x-k8s.io/v1alpha4
// kind: Cluster
// nodes:
// - role: control-plane
//   extraPortMappings:
//   - containerPort: 30000
//     hostPort: 30000
//     listenAddress: "0.0.0.0" # Optional, defaults to "0.0.0.0"
//     protocol: tcp # Optional, defaults to tcp
// - role: worker
// - role: worker