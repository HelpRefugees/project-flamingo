export default class AuthService {
  login(credentials) {
    return fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials)
    }).then(response => response.status === 200);
  }
}
