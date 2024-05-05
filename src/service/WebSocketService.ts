// WebSocketService.ts
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  private stompClient: any;
  private messageCallbacks: ((msg: any) => void)[] = [
    (msg) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(msg._binaryBody);
      console.log(text);
    },
  ];

  connect(chatId: number) {
    const serverUrl = `ws://192.168.1.101:8080/wschat`;
    this.stompClient = Stomp.client(serverUrl);
    this.stompClient.connect({}, (frame: any) => {
      console.log("Connected: " + frame);
      this.subscribe(chatId);
    });
  }

  subscribe(chatId: number) {
    this.stompClient.subscribe(`/topic/messages/${chatId}`, (message: any) => {
      this.messageCallbacks.forEach((callback) => callback(message));
    });
  }

  sendMessage(chatId: number, msg: any): void {
    this.stompClient.send(`/app/chat/send/${chatId}`, {}, JSON.stringify(msg));
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

export default new WebSocketService();
