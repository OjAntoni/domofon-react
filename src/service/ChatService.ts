class ChatService {
  getChatById(id: number): Promise<ChatConversationResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `http://192.168.1.101:8080/chat/${id}`);
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Assuming the response is a JSON object that matches the Chat interface
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.statusText));
        }
      };
      xhr.onerror = () => reject(new Error(xhr.statusText));
      xhr.send();
    });
  }

  startNewChat(toUser: string): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `http://192.168.1.101:8080/chat?to=${toUser}`);
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Assuming the response is a JSON object that matches the Chat interface
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.statusText));
        }
      };
      xhr.onerror = () => reject(new Error(xhr.statusText));
      xhr.send();
    });
  }
}

export default ChatService;
