
## List of Requirements
[View List of Required Features](Mock StackOverflow Requirements.pdf)

## Repository Structure 
The repository is structured as follows:
* The `client/` directory. This contains all the logic for the user interface. Components are in the `src/components/` directory. The `package.json` file contains all dependencies for the `client/`. The `cypress/` directory contains all e2e tests and the component tests. 
* The `server/` directory contains all logic for the application’s server. The starting point is `server.js`. The file `config.js` contains server configuration settings. Currently, it has the URLs for the local instances of the node server and MongoDB service. The init.js file has some starter code to connect to a MongoDB database instance running locally. The `destroy.js` file is used to delete the entire database and start afresh whenever necessary. The `tests/` directory contains all unit testing files. The `package.json` file contains all dependencies for the `server/`. 

## Deployment
The `client/` and the `server/` directory have a file named `Dockerfile`. These files contain commands to install a client and server application on a docker container and run them in the container. The project root has a file `docker-compose.yml` file. This file has commands to build the project. Building the project includes creating an image of MongoDB in a docker container, transferring all client and server files to the same container, and executing the server followed by the client on the container. 
Steps to run docker:
1.	Install docker by referring - https://docs.docker.com/engine/install/ 
2.	Ensure you have docker set-up on your host machines and the docker daemon is up and running.
3.	Update the Mongodb url as per the docker-compose.yml, i.e. update mongodb://localhost:27017/fake_so to mongodb://mongodb:27017/fake_so
4.	From the main project directory, run the command to generate the images and start the containers
5.	Run the command docker-compose up from the project root.
This should result in the container being up and running. Start the application from your browser.

## Regarding Testing:
We used a SnackBar to display error messages when users attempt to do certain actions.
Cypress has trouble getting the SnackBar and because of this, these tests are flaky.
When running the tests, if the test mentions a SnackBar, it does regularly pass, but if it fails, this is due to it being flaky.


## List of features


| Feature                                   | Description                                                                                | E2E Tests                        | Component Tests                                                                              | Jest Tests  ('<Endpoint>': <path/to/endpoint)                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------|----------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| User Validation / Authentication          | Validate user identity throughout application.                                             | /client/cypress/e2e/userAuth     | /client/cypress/component/userAuth                                                           | '/user/validateAuth' & '/user/csrf-token': /server/tests/accounts                                  |
| View Posts                                | Allow users to view existing posts, including metadata (i.e., vote count) on the platform. | /client/cypress/e2e/viewPosts    | /client/cypress/component/viewPosts                                                          | '/question/getQuestion' & '/question/getQuestionByID/:qid': /server/tests/viewPosts                |
| Create New Posts                          | Allow users to compose and publish new posts.                                              | /client/cypress/e2e/createPosts  | /client/cypress/component/createPosts                                                        | '/question/addQuestion' & '/answer/addAnswer': /server/tests/createPosts                           |
| Search for Existing Posts                 | Allow users to search for specific posts or topics.                                        | /client/cypress/e2e/search       | /client/cypress/component/search                                                             | '/question/getQuestion': /server/tests/search                                                      |
| Commenting on Posts                       | Allow users to add comments to existing posts.                                             | /client/cypress/e2e/comments     | /client/cypress/component/comments                                                           | '/comment/addCommentToQuestion' & '/comment/addCommentToAnswer': /server/tests/comments            |
| Voting on Posts                           | Increases or decreases the score of a question or answer depending on user voting.         | /client/cypress/e2e/voting       | /client/cypress/component/voting                                                             | '/vote/addVoteTo{Question/Answer/Comment}': /server/tests/voting                                   |
| Tagging Posts                             | Association of terms or keywords when creating questions, and suggestion of tags.          | /client/cypress/e2e/tagging      | /client/cypress/component/tagging & /client/cypress/component/createPosts/new_question.cy.js | '/question/addQuestion': /server/tests/createPosts                                                 |
| Viewing User Profiles                     | Show user information, summary statistics, and views of a user’s posts.                    | /client/cypress/e2e/profiles     | /client/cypress/component/profiles                                                           | '/profile/view/:uid': /server/tests/profiles                                                       |
| Editing User Profiles (EXTRA CREDIT)      | Show options that a user can edit and update them accordingly.                             | /client/cypress/e2e/editProfiles | /client/cypress/component/editProfiles                                                       | '/profile/edit': /server/tests/profiles                                                            |
| Post Moderation                           | User moderation to open or close question threads and flag for inappropriate posts.        | /client/cypress/e2e/mod          | /client/cypress/component/mod                                                                | '/vote/addVoteTo{Question/Answer/Comment}' & '/isAuthorizedToVote/:voteType': /server/tests/voting |
| Account Creation / Sign In (EXTRA CREDIT) | Creates a new user account or updates session to use an existing one.                      | /client/cypress/e2e/accounts     | /client/cypress/component/accounts                                                           | '/user/login' & '/user/logout' & '/user/signUp': /server/tests/accounts                            |
| Mark Post as Solution (EXTRA CREDIT)      | Allow users to mark an answer post as the solution to a specific question.                 | /client/cypress/e2e/solution     | /client/cypress/component/solution                                                           | '/answer/markAnswerAsSolution': /server/tests/solution                                             |


## Prerequisites:
- Install MongoDB on your local machine.
- Install NodeJS on your local machine.

## Dependency Setup Instructions (From root):
```
cd server
npm install
cd ../client
npm install
```

## Database Initialization Instructions:
```
cd server
node init.js
```

## Instructions to generate and view coverage report 

Generate the coverage report by running the following instructions:
```
cd server
npx jest --runInBand --coverage
```
