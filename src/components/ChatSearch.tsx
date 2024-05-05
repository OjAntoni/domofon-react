import React, { useEffect, useState } from "react";
import "../style/form.scss";
import "../style/chatsearch.scss";

const ChatSearch = ({
  onChatSearchChange,
}: {
  onChatSearchChange: (newValue: string) => void;
}) => {
  const [chatName, setChatName] = useState<string>(() => {
    return localStorage.getItem("chatName") || "";
  });

  useEffect(() => {
    // Save chatName to localStorage whenever it changes
    localStorage.setItem("chatName", chatName);
  }, [chatName]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
    onChatSearchChange(e.target.value);
  };

  return (
    <div className="chats__search">
      <h2 className="chats__header">Messages</h2>
      <input
        className="form__input chats__input"
        type="text"
        placeholder="Search for chats"
        onChange={onInputChange}
        value={chatName}
      />
    </div>
  );
};

export default ChatSearch;
