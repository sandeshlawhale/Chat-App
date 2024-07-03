import "./chat.scss";
import {
  FaInfoCircle,
  FaPhone,
  FaVideo,
  FaImage,
  FaCamera,
  FaMicrophone,
} from "react-icons/fa";
import { BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { uploadImage } from "../../lib/uploadImage";
import Image from "../image/Image";
import { onAuthStateChanged } from "firebase/auth";
import { BiLoaderAlt } from "react-icons/bi";

function Chat() {
  const { chatId, user, isCurrentUserBlocked, isRecieverUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [text, setText] = useState("");
  const [displayImg, setDisplayImg] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = async (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        setImgUploading(true);
        imgUrl = await uploadImage(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          cretedAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchat", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
      setImgUploading(false);
    } catch (error) {
      console.log(error);
    }

    setText("");
    setImg({
      file: null,
      url: "",
    });
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <>
      <div className="chat">
        <div className="top">
          <div className="user">
            <img
              src={user?.avatar || "/avatar.png"}
              alt=""
              onClick={() => setDisplayImg(user?.avatar)}
            />
            <div className="texts">
              <span>{user?.username || user}</span>
              <p>{user?.bio}</p>
            </div>
          </div>
          <div className="icons">
            <FaPhone />
            <FaVideo />
            <FaInfoCircle />
          </div>
        </div>
        <div className="center">
          {chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.id ? "message own" : "message"
              }
              key={Math.random()}
            >
              {/* <img src="/avatar.png" alt="" /> */}
              <div className="texts">
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                {/* <span>1 sec ago</span> */}
              </div>
            </div>
          ))}
          {img.url && (
            <div className="message own">
              <div className="texts">
                <img src={img.url} alt="" />
                {imgUploading && <BiLoaderAlt />}
              </div>
            </div>
          )}
          {chat?.messages && <div ref={endRef}></div>}
        </div>
        <div className="bottom">
          <div className="icons">
            <label htmlFor="imgfile">
              <FaImage />
            </label>
            <input
              type="file"
              id="imgfile"
              style={{ display: "none" }}
              onChange={handleImage}
            />
            <FaCamera />
            <FaMicrophone />
          </div>
          <input
            type="text"
            placeholder={
              isCurrentUserBlocked || isRecieverUserBlocked
                ? "You cannot type a message"
                : "Type a message.."
            }
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            disabled={isCurrentUserBlocked || isRecieverUserBlocked}
          />
          <div className="emoji">
            <BsEmojiLaughing
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          <button
            className="sendBtn"
            onClick={handleSend}
            disabled={
              isCurrentUserBlocked || isRecieverUserBlocked || imgUploading
            }
          >
            Send
          </button>
        </div>
      </div>
      {displayImg && <Image src={displayImg} setDisplayImg={setDisplayImg} />}
    </>
  );
}

export default Chat;
