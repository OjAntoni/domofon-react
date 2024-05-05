import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Profile from "./components/Profile";
import "./style/app.scss";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatSearch from "./components/ChatSearch";
import "./style/chats.scss";
import ResizableDiv from "./components/ResizableDiv";
import { ImageProvider } from "./context/ImageContext";
import PublicRoute from "./components/PublicRoute";
import NotificationWSService from "./service/NotificationWSService";
import { debounce } from "lodash";

function App() {
  const [chatId, setChatId] = useState<number>(-1);
  const [chatName, setChatName] = useState<string>("");
  const [toUser, setToUser] = useState<string>("");
  const [chatsUpdateNeeded, setChatUpdateNeeded] = useState<boolean>(false);
  const [img, setImg] = useState<string>("");
  const [key, setKey] = useState(0);
  let notificationService;

  useEffect(() => {
    notificationService = NotificationWSService;
    notificationService.onMessageReceived((msg) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(msg._binaryBody);
      console.log(text);

      setKey((prevKey) => prevKey + 1);
    });
  }, []);

  const handleChatSelect = (chatId: number, to: string) => {
    console.log("handleChatSelect");
    console.log(to);
    setChatId(chatId); // Update the selectedChatId state when a chat is selected
    setToUser(to);
  };

  const onChatSearchChange = (chat: string) => {
    setChatName(chat);
  };

  const onNewChatCreated = (newChatId: number) => {
    console.log(chatsUpdateNeeded);

    setChatUpdateNeeded(() => !chatsUpdateNeeded); // This should trigger ChatList to refresh
  };

  const onImageChanged = (newImg: string) => {
    setImg(newImg);
  };

  return (
    <>
      <BrowserRouter>
        <div className="app">
          <div className="main-content">
            <ImageProvider>
              <Routes>
                <Route element={<PublicRoute redirectTo="/" />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/" element={<PrivateRoute />}>
                  <Route
                    path="profile"
                    element={<Profile onImageChange={onImageChanged}></Profile>}
                  />
                  <Route
                    index
                    element={
                      <>
                        <ResizableDiv
                          initialWidth={490}
                          minWidth={380}
                          maxWidth={1000}
                          content={
                            <>
                              <div className="chats-wrapper">
                                <ChatSearch
                                  onChatSearchChange={onChatSearchChange}
                                />
                                <ChatList
                                  key={key}
                                  onChatSelected={handleChatSelect}
                                  chatToSearch={chatName}
                                  refreshChatList={chatsUpdateNeeded}
                                />
                              </div>
                            </>
                          }
                        />
                        <Chat
                          chatId={chatId}
                          toUser={toUser}
                          shouldUpdateChatList={onNewChatCreated}
                        />
                      </>
                    }
                  />
                </Route>
              </Routes>
            </ImageProvider>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
