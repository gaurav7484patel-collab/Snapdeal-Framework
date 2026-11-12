pipeline {
  agent any        // where the pipeline runs
 tools {
        nodejs 'NodeJS'
   }
  stages {
    stage('Build') {
      steps {
       // bat 'npm install'
       // bat 'npx playwright test'
        sh 'npm install'
        sh 'npx playwright test '
      }
    }
  }
}




