// Setup database with initial test data.
const mongoose = require("mongoose");

const {MONGO_URL} = require("./config");

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Comment = require('./models/comments');
let User = require('./models/users');
let Vote = require('./models/votes');

mongoose.connect(MONGO_URL);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function tagCreate(name) {
  let tag = new Tag({name: name});
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments, votes, score) {
  let answerdetail = {text: text, score: score};
  if (comments !== false) answerdetail.comments = comments;
  if (votes !== false) answerdetail.votes = votes;
  if (ans_by !== false) answerdetail.ans_by = ans_by;
  if (ans_date_time !== false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function commentCreate(text, comment_by, comment_date_time, votes) {
  let commentdetail = {text: text, comment_by: comment_by};
  if (comment_date_time !== false) commentdetail.comment_date_time = comment_date_time;
  if (votes !== false) commentdetail.votes = votes;

  let comment = new Comment(commentdetail);
  return comment.save();
}

function userCreate(
  email, first_name, last_name,
  display_name, password, about_summary,
  date_joined, time_last_seen, reputation
) {
  let userdetail = {
    email: email,
    password: password,
    first_name: first_name,
    last_name: last_name,
    display_name: display_name,
    date_joined: date_joined,
    time_last_seen: time_last_seen,
    reputation: reputation
  };
  if (about_summary !== false) userdetail.about_summary = about_summary;

  let user = new User(userdetail);
  return user.save();
}

function voteCreate(voter, vote_type, vote_reason) {
  let votedetail = {voter: voter, vote_type: vote_type};

  if (vote_reason !== false) votedetail.vote_reason = vote_reason;

  let vote = new Vote(votedetail);
  return vote.save();
}

function questionCreate(
  title, text, tags, answers,
  asked_by, ask_date_time, views, comments,
  votes, solution, score, status) {
  let qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers !== false) qstndetail.answers = answers;
  if (comments !== false) qstndetail.comments = comments;
  if (votes !== false) qstndetail.votes = votes;
  if (ask_date_time !== false) qstndetail.ask_date_time = ask_date_time;
  if (views !== false) qstndetail.views = views;
  if (solution !== false) qstndetail.solution = solution;
  if (score !== false) qstndetail.score = score;
  if (status !== false) qstndetail.status = status;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const init = async () => {
  console.log('insert test data into the database')
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');
  let t5 = await tagCreate('storage');
  let t6 = await tagCreate('website');
  let t7 = await tagCreate('flutter');
  let u1 = await userCreate(
    "test1@gmail.com", "Marko", "Krstulovic",
    "mkrstulovic", "test123", "I AM A CODER. I LOVE CODE.",
    new Date('2023-04-03T18:20:59'), new Date('2023-04-04T18:20:59'), 40000
  );
  let u2 = await userCreate(
    "test2@gmail.com", "Thean", "Lim",
    "thean", "test123", "I AM A CODER. I LOVE CODE.",
    new Date('2023-04-03T18:20:59'), new Date('2023-04-04T18:20:59'), 1500
  );
  let u3 = await userCreate(
    "test2@gmail.com", "Vote", "Up",
    "voteUp", "test123", "",
    new Date('2023-04-03T18:20:59'), new Date('2023-04-04T18:20:59'), 15
  );
  let u4 = await userCreate(
    "test2@gmail.com", "Vote", "Down",
    "voteDown", "test123", "",
    new Date('2023-04-03T18:20:59'), new Date('2023-04-04T18:20:59'), 125
  );
  let u5 = await userCreate(
    "test2@gmail.com", "Comment", "Here",
    "commenter", "test123", "",
    new Date('2023-04-03T18:20:59'), new Date('2023-04-04T18:20:59'), 50
  );
  let v1 = await voteCreate(
    u1, "close", "Bad Question"
  );
  let v1b = await voteCreate(
    u1, "close", "No content"
  );
  let v1c = await voteCreate(
    u1, "close", "Impossible to answer"
  );
  let v2 = await voteCreate(
    u2, "upvote", ""
  );
  let v3 = await voteCreate(
    u3, "upvote", ""
  );
  let v4 = await voteCreate(
    u4, "downvote", ""
  );
  let v5 = await voteCreate(
    u1, "flag", "Inappropriate content"
  );
  let v5b = await voteCreate(
    u1, "flag", "No added content"
  );
  let v6 = await voteCreate(
    u2, "flag", "Inflammatory content"
  );
  let c1 = await commentCreate(
    "Comment 1", u5, new Date('2023-04-03T18:20:59'), [v5b]
  );
  let c2 = await commentCreate(
    "Comment 2", u1, new Date('2023-04-03T19:20:59'), []
  );
  let c3 = await commentCreate(
    "Comment 3", u2, new Date('2023-04-03T20:20:59'), []
  );
  let c4 = await commentCreate(
    "Comment 4", u5, new Date('2023-04-03T21:20:59'), []
  );
  let c5 = await commentCreate(
    "Comment 5", u5, new Date('2023-04-03T22:20:59'), []
  );
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
    u1, new Date('2023-11-20T03:24:42'), [c1],
    [v2, v3], 2);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
    u2, new Date('2023-11-23T08:24:00'), [],
    [v2], 1);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
    u3, new Date('2023-11-18T09:24:00'), [],
    [v2, v3], 2);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
    u4, new Date('2023-11-12T03:30:00'), [c2],
    [v2, v4], 0);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ',
    u5, new Date('2023-11-01T15:24:19'), [],
    [v4, v5b], -1);
  let a6 = await answerCreate('Storing content as BLOBs in databases.',
    u1, new Date('2023-02-19T18:20:59'), [],
    [], 0);
  let a7 = await answerCreate('Using GridFS to chunk and store content.',
    u2, new Date('2023-02-22T17:19:00'), [c3],
    [], 0);
  let a8 = await answerCreate('Store data in a SQLLite database.',
    u3, new Date('2023-03-22T21:17:53'), [],
    [v5], 0);
  await questionCreate('Programmatically navigate using React router',
    'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.',
    [t1, t2], [a1, a2], u1, new Date('2022-01-20T03:00:00'), 10,
    [c4], [v2, v3], a1, 2, "open");
  await questionCreate('android studio save string shared preference, start activity and load the saved string',
    'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
    [t3, t4, t2], [a3, a4, a5], u2, new Date('2023-01-10T11:24:30'), 121,
    [c5], [v2], a3, 1, "open");
  await questionCreate('Object storage for a web application',
    'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    [t5, t6], [a6, a7], u3, new Date('2023-02-18T01:02:15'), 200,
    [], [v2, v3, v4], null, 2, "open");
  await questionCreate('Quick question about storage on android',
    'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    [t3, t4, t5], [a8], u4, new Date('2023-03-10T14:28:01'), 103,
    [], [], null, 0, "open");
  await questionCreate('What does the Fox Say?',
    'I really need to know what the fox says. Somebody help!!!',
    [t1], [], u5, new Date('2023-04-01T14:28:01'), 1030,
    [], [v1, v1b, v1c, v4, v6], null, -1, "closed");

  if (db) db.close();

  console.log("done");
};

init().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
