const supertest = require("supertest")

const {default: mongoose} = require("mongoose");

let server;

beforeEach(() => {
  server = require("../server");
})
afterEach(async () => {
  server.close();
  await mongoose.disconnect()
});


test('Expect server to hit dummy endpoint', async () => {
  let response = await supertest(server).get('/');
  expect(response.status).toBe(200);
  expect(response.body).toEqual({message: "Fake SO Server Dummy Endpoint"});
});
