import NotificationWSService from "../service/NotificationWSService";

class AuthService {
  login(username: string, password: string): Promise<any> {
    return fetch("http://192.168.1.101:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.clear();
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username);
          NotificationWSService.connect(username);
        }
        return data;
      });
  }

  logout(): void {
    localStorage.clear();
  }

  register(username: string, password: string): Promise<any> {
    return fetch("http://192.168.1.101:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  }

  getCurrentUserToken(): string | null {
    const token = localStorage.getItem("token");
    return token;
  }
}

export default new AuthService();
