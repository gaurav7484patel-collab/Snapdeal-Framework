pipeline {
  agent any        // where the pipeline runs
 tools {
        nodejs 'NodeJS'
   }
  stages {
    stage('Build') {
      steps {
        //for windows
       bat 'npm install'
       bat 'npx playwright install chromium'
       bat 'npx playwright test'
       //For mac
        //  'npm install'
        //  'npx playwright test '
      
      }
    }
  }
}