import { useEffect, useState } from "react";
import "./list.scss";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { useUserStore } from "../../lib/userStore";
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import Bio from "./Bio/Bio";
import More from "./more/More";
import Image from "../image/Image";

function List() {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [bio, setBio] = useState(false);
  const [more, setMore] = useState(false);
  const [displayImg, setDisplayImg] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchat", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = getDoc(userDocRef);

          const user = (await userDocSnap).data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchat", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filterdChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="list">
      <div className="userDetails">
        <div className="user">
          <img
            src={currentUser.avatar || "./avatar.png"}
            alt=""
            onClick={() => setDisplayImg(currentUser.avatar)}
          />
          <p>{currentUser.username}</p>
        </div>
        <div className="icons">
          <div className="moreIcon" onClick={() => setMore((prev) => !prev)}>
            <BsThreeDots title="More about the User" />
            {more && <More />}
          </div>
          <CiEdit
            onClick={() => setBio((prev) => !prev)}
            title="Edit user Details"
          />
        </div>
      </div>

      <div className="chatlist">
        <div className="search">
          <div className="searchbox">
            <FaSearch />
            <input
              type="text"
              name="inputfield"
              placeholder="Type a user name..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div
            className="add"
            onClick={() => {
              setAddMode((prev) => !prev);
            }}
          >
            {addMode ? <FaMinus /> : <FaPlus />}
          </div>
        </div>
        <div className="chatUser">
          {filterdChats.map((chat) => (
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "/avatar.png"
                    : chat.user.avatar || "/avatar.png"
                }
                alt=""
              />
              <div className="texts">
                <span>
                  {chat.user.blocked.includes(currentUser.id)
                    ? "user"
                    : chat.user.username}
                </span>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {displayImg && <Image src={displayImg} setDisplayImg={setDisplayImg} />}
      {bio && <Bio setBio={setBio} />}
      {addMode && <AddUser />}
    </div>
  );
}

export default List;
