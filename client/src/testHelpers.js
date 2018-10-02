export const assertLater = (done: any, body: () => void) => {
  setTimeout(() => {
    try {
      body();
      done();
    } catch (err) {
      done.fail(err);
    }
  });
};
