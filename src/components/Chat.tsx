import React, { useState, useEffect, useRef } from "react";
import WebSocketService from "../service/WebSocketService";
import ChatService from "../service/ChatService";
import "../style/chat.scss";
import { formatDate, getDayOfWeek, isWithinLast7Days } from "../util/TimeUtil";
import { debounce } from "lodash";

enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
}

const ChatComponent: React.FC<{
  chatId: number;
  toUser: string;
  shouldUpdateChatList: (id: number) => void;
}> = ({ chatId, toUser, shouldUpdateChatList }) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [img, setImg] = useState<string | null>(null);
  const [scrollDown, setScrollDown] = useState(0);
  const chatService = new ChatService();
  const scrollRef = useRef<HTMLDivElement>(null);
  let prevMessage: MessageResponse | undefined;

  useEffect(() => {
    console.log(chatId);

    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentId, scrollDown]);

  useEffect(() => {
    console.log("In Use Effect on messages:");
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (chatId > 0) {
        const data = await chatService.getChatById(chatId);
        setMessages(data.messages);
        setCurrentId(data.id);
        setImg(
          data.participants.filter(
            (u) => u.username !== localStorage.getItem("username")
          )[0].imageUrl
        );
      } else {
        setMessages([]);
        setCurrentId(null);
      }
    };

    initializeChat();
  }, [chatId]);

  useEffect(() => {
    if (currentId) {
      WebSocketService.connect(currentId);
      WebSocketService.onMessageReceived(addMessage);

      return () => {
        WebSocketService.disconnect();
        WebSocketService.removeMessageReceivedCallback(addMessage);
      };
    }
  }, [currentId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Perform your action here, e.g., logging

            let msg = messages.find((m) => m.id === Number(entry.target.id));
            // console.log(msg);
            // console.log(msg?.status);

            if (
              currentId &&
              msg?.status &&
              msg.status !== "READ" &&
              msg.from !== localStorage.getItem("username")
            ) {
              console.log(`Sending request for update`);
              msg.status = MessageStatus.READ;

              WebSocketService.sendMessage(currentId, msg);
            }

            let messageTextElement =
              entry.target.querySelector(".message__text");
            // console.log(`Item ${messageTextElement?.textContent} is visible`);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: [0],
      }
    );

    // Start observing each item
    document.querySelectorAll(".msg").forEach((item) => observer.observe(item));

    return () => observer.disconnect(); // Cleanup observer on component unmount
  });

  const addMessage = (msg: any) => {
    debounce(() => {}, 500);
    const decoder = new TextDecoder("utf-8");
    const newMsg = JSON.parse(decoder.decode(msg._binaryBody));
    console.log(`Recieved message with id ${newMsg.id}`);
    console.log(messages);

    setMessages((prevMessages) => {
      const existingMsgIndex = prevMessages.findIndex(
        (m) => m.id === newMsg.id
      );

      if (existingMsgIndex >= 0) {
        // Create a new array with the message updated
        const updatedMessages = prevMessages.map((message, index) =>
          index === existingMsgIndex ? newMsg : message
        );
        return updatedMessages;
      } else {
        // Message does not exist, add as new
        return [...prevMessages, newMsg];
      }
    });
    setScrollDown((prev) => prev + 1);
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      if (!currentId) {
        const res = await chatService.startNewChat(toUser);
        if (res && res.id) {
          setCurrentId(res.id);
          WebSocketService.connect(res.id);
          await delay(200); // Reduced delay to improve responsiveness
          WebSocketService.sendMessage(res.id, {
            from: localStorage.getItem("username"),
            text: newMessage,
          });
          await delay(200); // Reduced delay to improve responsiveness
          shouldUpdateChatList(res.id);
          setNewMessage("");
        }
      } else {
        WebSocketService.sendMessage(currentId, {
          from: localStorage.getItem("username"),
          text: newMessage,
        });
        await delay(200);
        shouldUpdateChatList(currentId);
        setNewMessage("");
      }
    }
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const parseDate = (date: Date): string => {
    let now = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const isDateNeededInChat = (newMsg: MessageResponse): boolean => {
    let prevDate;
    if (prevMessage) prevDate = new Date(prevMessage?.dateTime);
    let newElemDate = new Date(newMsg.dateTime);

    if (
      !prevMessage ||
      prevDate?.getDate() !== newElemDate.getDate() ||
      prevDate?.getMonth() !== newElemDate.getMonth() ||
      prevDate?.getFullYear() !== newElemDate.getFullYear()
    ) {
      updatePrevMessage(newMsg);
      return true;
    } else {
      updatePrevMessage(newMsg);
      return false;
    }
  };

  const updatePrevMessage = (msg: MessageResponse) => {
    prevMessage = msg;
  };

  const parseTimeForChat = (date: Date): string => {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${month[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="chat-container">
      <div className="chat-container__header-wrapper">
        <div className="chat-container__image-wrapper">
          {img && <img src={img} alt="user photo" />}
        </div>
        <h2 className="chat-container__header">{toUser}</h2>
      </div>

      <div className="chat-container__conversation" ref={scrollRef}>
        {messages
          .sort((a, b) => {
            return (
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          })
          .map((message, index) => (
            <>
              {isDateNeededInChat(message) && (
                <p className="chat-container__date">
                  {parseTimeForChat(new Date(message.dateTime))}
                </p>
              )}
              <div
                id={message.id + ""}
                className={
                  "msg " +
                  (message.from === localStorage.getItem("username")
                    ? "message-mine"
                    : "message")
                }
              >
                <p className="message__text" key={index}>
                  {message.text}
                </p>
                <p className="message__date">
                  {parseDate(new Date(message.dateTime))}
                </p>
                <p className="message__status">{message.status}</p>
              </div>
            </>
          ))}
      </div>

      <div className="chat-container__input-wrapper">
        <textarea
          className="chat-container__input form__input "
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="chat-container__button"
          disabled={!chatId}
          onClick={sendMessage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path
              fill="#fff"
              d="M10 20A10 10 0 1 0 0 10a10 10 0 0 0 10 10zM8.711 4.3l5.7 5.766L8.7 15.711l-1.4-1.422 4.289-4.242-4.3-4.347z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
