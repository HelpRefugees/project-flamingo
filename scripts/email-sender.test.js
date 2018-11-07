const nock = require("nock");

const emailSender = require("./email-sender");

describe("email sender", () => {
  const domain = "http://example.org";
  const hook = "/some/hook/";

  beforeEach(() => {
    process.env.EMAIL_WEBHOOK = `${domain}${hook}`;
  });

  afterEach(() => {
    delete process.env.EMAIL_WEBHOOK;
  });

  it("hits the webhook", () => {
    const task = "some-message";
    const recipients = ["foo@bar.com", "daisy@hr.com"];
    const scope = nock(domain)
      .post(hook, { task, recipients })
      .reply(200);

    return emailSender.send(task, recipients).then(() => scope.done());
  });

  it("does not hit the webhook if there are no recipients", done => {
    const task = "some-message";
    const scope = nock(domain);

    return emailSender
      .send(task, [])
      .then(() => done.fail("should reject promise with no recipients"))
      .catch(() => {
        scope.done();
        done();
      });
  });

  it("adds extra parameters", () => {
    const task = "some-message";
    const recipients = ["foo@bar.com", "daisy@hr.com"];
    const scope = nock(domain)
      .post(hook, { task, recipients, foo: "bar" })
      .reply(200);

    return emailSender
      .send(task, recipients, { foo: "bar" })
      .then(() => scope.done());
  });

  it("rejects the promise if the request fails", done => {
    const task = "some-message";
    const recipients = ["foo@bar.com", "daisy@hr.com"];
    const scope = nock(domain)
      .post(hook, { task, recipients })
      .reply(404);

    return emailSender
      .send(task, recipients)
      .then(() => done.fail("should reject promise with failing request"))
      .catch(err => {
        expect(err).toBe(404);
        scope.done();
        done();
      });
  });
});
