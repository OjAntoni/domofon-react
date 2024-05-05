// WebSocketService.ts
import { Stomp } from "@stomp/stompjs";

class NotificationWSService {
  private stompClient: any;
  private user: string | undefined;

  private messageCallbacks: ((msg: any) => void)[] = [
    (msg) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(msg._binaryBody);
      console.log(text);
    },
  ];

  connect(user: string) {
    this.user = user;

    const serverUrl = `ws://192.168.1.101:8080/wschat`;
    this.stompClient = Stomp.client(serverUrl);
    this.stompClient.connect({}, (frame: any) => {
      console.log("Connected: " + frame);
      this.subscribe(user);
    });
  }

  subscribe(user: string) {
    this.stompClient.subscribe(`/topic/messages/${user}`, (message: any) => {
      this.messageCallbacks.forEach((callback) => callback(message));
    });
    console.log("subscribed to " + `/topic/messages/${user}`);
  }

  sendNotification(msg: any): void {
    this.stompClient.send(
      `/app/chat/send/${this.user}`,
      {},
      JSON.stringify(msg)
    );
  }

  onMessageReceived(callback: (msg: any) => void) {
    this.messageCallbacks.push(callback);
  }

  removeMessageReceivedCallback(callbackToRemove: (msg: any) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(
      (callback) => callback !== callbackToRemove
    );
  }

  removeAllCallbacks() {
    this.messageCallbacks = [];
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}

export default new NotificationWSService();
