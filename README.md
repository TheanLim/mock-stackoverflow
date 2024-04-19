[![Continuous Integration](https://github.com/CSE-316-Software-Development/final-project-marko-thean/actions/workflows/ci.yml/badge.svg)](https://github.com/CSE-316-Software-Development/final-project-marko-thean/actions/workflows/ci.yml)
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of Requirements
[View List of Required Features](https://docs.google.com/document/d/1GK8ENPpDvcV6Z5iWohmAPjmR76EHyWVnKtPXWwGFc5w/edit?usp=sharing)

## List of features

All the features you have implemented. 

| Feature                              | Description                                                                                | E2E Tests                        | Component Tests                                                                              | Jest Tests                                                                                         |
|--------------------------------------|--------------------------------------------------------------------------------------------|----------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| User Validation / Authentication     | Validate user identity throughout application.                                             | /client/cypress/e2e/userAuth     | /client/cypress/component/userAuth                                                           | '/user/validateAuth' & '/user/csrf-token': /server/tests/accounts                                  |
| View Posts                           | Allow users to view existing posts, including metadata (i.e., vote count) on the platform. | /client/cypress/e2e/viewPosts    | /client/cypress/component/viewPosts                                                          | '/question/getQuestion' & '/question/getQuestionByID/:qid': /server/tests/viewPosts                |
| Create New Posts                     | Allow users to compose and publish new posts.                                              | /client/cypress/e2e/createPosts  | /client/cypress/component/createPosts                                                        | '/question/addQuestion' & '/answer/addAnswer': /server/tests/createPosts                           |
| Search for Existing Posts            | Allow users to search for specific posts or topics.                                        | /client/cypress/e2e/search       | /client/cypress/component/search                                                             | '/question/getQuestion': /server/tests/search                                                      |
| Commenting on Posts                  | Allow users to add comments to existing posts.                                             | /client/cypress/e2e/comments     | /client/cypress/component/comments                                                           | '/comment/addCommentToQuestion' & '/comment/addCommentToAnswer': /server/tests/comments            |
| Voting on Posts                      | Increases or decreases the score of a question or answer depending on user voting.         | /client/cypress/e2e/voting       | /client/cypress/component/voting                                                             | '/vote/addVoteTo{Question/Answer/Comment}': /server/tests/voting                                   |
| Tagging Posts                        | Association of terms or keywords when creating questions, and suggestion of tags.          | /client/cypress/e2e/tagging      | /client/cypress/component/tagging & /client/cypress/component/createPosts/new_question.cy.js | '/question/addQuestion': /server/tests/createPosts                                                 |
| Viewing User Profiles                | Show user information, summary statistics, and views of a user’s posts.                    | /client/cypress/e2e/profiles     | /client/cypress/component/profiles                                                           | '/profile/view/:uid': /server/tests/profiles                                                       |
| Editing User Profiles (EXTRA CREDIT) | Show options that a user can edit and update them accordingly.                             | /client/cypress/e2e/editProfiles | /client/cypress/component/editProfiles                                                       | '/profile/edit': /server/tests/profiles                                                            |
| Post Moderation                      | User moderation to open or close question threads and flag for inappropriate posts.        | /client/cypress/e2e/mod          | /client/cypress/component/mod                                                                | '/vote/addVoteTo{Question/Answer/Comment}' & '/isAuthorizedToVote/:voteType': /server/tests/voting |
| Account Creation / Sign In           | Creates a new user account or updates session to use an existing one.                      | /client/cypress/e2e/accounts     | /client/cypress/component/accounts                                                           | '/user/login' & '/user/logout' & '/user/signUp': /server/tests/accounts                            |
| Mark Post as Solution (EXTRA CREDIT) | Allow users to mark an answer post as the solution to a specific question.                 | /client/cypress/e2e/solution     | /client/cypress/component/solution                                                           | '/answer/markAnswerAsSolution': /server/tests/solution                                             |


## Instructions to generate and view coverage report 

## Extra Credit Section (if applicable)