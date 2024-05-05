import React, { useEffect, useState } from "react";
import AuthService from "../security/AuthService";
import { redirect, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { formatDate, getDayOfWeek, isWithinLast7Days } from "../util/TimeUtil";
import { useImageContext } from "../context/ImageContext";

const ChatList = ({
  onChatSelected,
  chatToSearch = "",
  refreshChatList,
}: {
  onChatSelected: (id: number, to: string) => void;
  chatToSearch?: string;
  refreshChatList?: boolean;
}) => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(
    undefined
  );
  const { imageUrl, setImageUrl, newMsgs, setNewMsgs } = useImageContext();
  let authService = AuthService;
  let navigate = useNavigate();
  let date: Date;

  // useEffect(() => {
  //   const loadChats = () => {
  //     let xhttp = new XMLHttpRequest();
  //     let resp: [any];
  //     xhttp.onload = function () {
  //       console.log(this.status);
  //       if (this.status == 403) {
  //         authService.logout();
  //         navigate("/login", { replace: true });
  //       } else {
  //         resp = JSON.parse(this.responseText);
  //         console.log(resp);
  //         setChats(() => {
  //           return resp;
  //         });
  //       }
  //     };

  //     xhttp.open(
  //       "GET",
  //       "http://localhost:8080/chat/all?chatName=" + chatToSearch,
  //       false
  //     );
  //     xhttp.setRequestHeader(
  //       "Authorization",
  //       "Bearer " + localStorage.getItem("token")
  //     );
  //     xhttp.send();
  //   };
  //   loadChats();
  // }, [chatToSearch]);

  useEffect(() => {
    const loadChats = () => {
      let xhttp = new XMLHttpRequest();
      let resp: [ChatResponse];
      xhttp.onload = function () {
        console.log(this.status);
        if (this.status == 403) {
          authService.logout();
          navigate("/login", { replace: true });
        } else {
          resp = JSON.parse(this.responseText);
          console.log("useEffect in reloading chats");
          let allUnread = resp
            .map((c) => c.unreadCount)
            .reduce((x, y) => x + y, 0);
          setNewMsgs(allUnread);
          console.log(resp);
          setChats(resp);
        }
      };

      xhttp.open(
        "GET",
        "http://192.168.1.101:8080/chat/all?chatName=" + chatToSearch
      );
      xhttp.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      xhttp.send();
    };
    loadChats();
    console.log("useEffect [refreshChatList]");
  }, [refreshChatList, chatToSearch]);

  const parseDate = (date: Date): string => {
    let now = new Date();
    if (
      now.getDay() == date.getDay() &&
      now.getMonth() == date.getMonth() &&
      now.getFullYear() == date.getFullYear()
    ) {
      return formatDate(date);
    } else if (isWithinLast7Days(date)) {
      return getDayOfWeek(date);
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className="chat-list">
      {chats?.map(
        (c, index) =>
          c.participants.filter(
            (u) => u.username !== localStorage.getItem("username")
          ).length > 0 && (
            <div
              className={"chat " + (c.id === selectedChatId && "chat-selected")}
              key={index}
              onClick={() => {
                onChatSelected(
                  c.id,
                  c.participants.filter(
                    (u) => u.username !== localStorage.getItem("username")
                  )[0].username
                );
                setSelectedChatId(c.id);
              }}
            >
              <div className="chat__icon">
                {c.participants.filter(
                  (u) => u.username !== localStorage.getItem("username")
                )[0]?.imageUrl && (
                  <img
                    src={
                      c.participants.filter(
                        (u) => u.username !== localStorage.getItem("username")
                      )[0].imageUrl
                    }
                    alt="user photo"
                  />
                )}
              </div>
              <div className="message-wrapper">
                <p className="chat__name">
                  {
                    c.participants.filter(
                      (u) => u.username !== localStorage.getItem("username")
                    )[0].username
                  }
                </p>
                <div className="chat__last-message">
                  <p className="last-message__text">
                    {c.lastMessage
                      ? c.lastMessage.from + ": " + c.lastMessage.text
                      : "Start new chat"}
                  </p>
                  <p className="chat__unread">{c.unreadCount}</p>
                  <p className="last-message__date">
                    {c.lastMessage
                      ? `${parseDate(new Date(c.lastMessage.dateTime))}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};
export default ChatList;
