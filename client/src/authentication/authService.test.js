import AuthService from "./authService";

describe("AuthService", () => {
  let service;

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce("{}");
    service = new AuthService();
  });

  it("makes a request to the backend with the appropriate credentials", () => {
    const username = "Demo Moore";
    const password = "logmeinplease";
    service.login({ username, password });

    expect(fetch.mock.calls.length).toEqual(1);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toEqual("/api/login");
    expect(options.method).toBe("POST");
    expect(options.headers["content-type"]).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({ username, password });
  });

  it("returns a promise of true if the requests returns 200", () => {
    return expect(service.login()).resolves.toBe(true);
  });
});
