import "./details.scss";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import { auth, db } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { DiVim } from "react-icons/di";
import Image from "../image/Image";
import Gallery from "../imgGallery/Gallery";

function Details() {
  const [settingArrow, setSettingArrow] = useState(false);
  const [privacyArrow, setPrivacyArrow] = useState(false);
  const [photosArrow, setPhotosArrow] = useState(true);
  const [fileArrow, setFileArrow] = useState(false);
  const [sharedImages, setSharedImages] = useState();
  const [displayImages, setDisplayImages] = useState([]);
  const [displayImg, setDisplayImg] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isRecieverUserBlocked,
    changeBlock,
  } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isRecieverUserBlocked
          ? arrayRemove(user.id)
          : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
      const messages = res.data().messages;
      const images = await messages.filter((msg) => msg.img);
      await images.sort((a, b) => b.cretedAt - a.cretedAt);
      setSharedImages(images);
      setDisplayImages(images.slice(0, 4));
    });

    return () => {
      unSub();
    };
  }, [chatId, currentUser, user]);
  return (
    <>
      <div className="details">
        <div className="user">
          <img
            src={user?.avatar || "/avatar.png"}
            alt=""
            onClick={() => setDisplayImg(user?.avatar)}
          />
          <div className="texts">
            <p>{user?.username}</p>
            <span>{user?.bio}</span>
            {user?.handle && user?.link && (
              <p className="handle">
                {user?.handle}:{" "}
                <a href={user?.link} target="_blank">
                  {user?.link}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="info">
          <div className="option">
            <div className="title">
              <p>Chat setting</p>
              <div
                className="arrow"
                onClick={(e) => setSettingArrow(!settingArrow)}
                style={{ cursor: " pointer" }}
              >
                {settingArrow ? <FaAngleDown /> : <FaAngleUp />}
              </div>
            </div>
            {settingArrow && (
              <p className="light" style={{ fontWeight: 100, paddingLeft: 10 }}>
                Soon will be added
              </p>
            )}
          </div>
          <div className="option">
            <div className="title">
              <p>Privacy & help</p>
              <div
                className="arrow"
                onClick={(e) => setPrivacyArrow(!privacyArrow)}
                style={{ cursor: " pointer" }}
              >
                {privacyArrow ? <FaAngleDown /> : <FaAngleUp />}
              </div>
            </div>
            {privacyArrow && (
              <div className="privacy">
                <h2>Privacy Policy</h2>
                <p>
                  Your privacy is important to us. Our chat app ensures that all
                  your communications are secure and confidential. We use
                  industry-standard encryption methods to protect your messages
                  and personal information. Your data is stored securely and is
                  never shared with third parties without your explicit consent.
                  We are committed to maintaining the confidentiality and
                  security of your information. If you have any concerns about
                  your privacy, please contact us directly.
                </p>

                <h2>Help Section</h2>
                <p>
                  Need help? We're here for you! Whether you're having trouble
                  with your account, experiencing technical issues, or have
                  questions about using the app, our support team is ready to
                  assist. Visit our Help Center for detailed guides and FAQs, or
                  reach out to our support team directly via the app's contact
                  form. We're dedicated to providing you with the best possible
                  experience and resolving any issues you encounter as quickly
                  as possible.
                </p>
              </div>
            )}
          </div>
          <div className="option">
            <div className="title">
              <p>Photos Shared</p>
              <div
                className="arrow"
                onClick={(e) => setPhotosArrow(!photosArrow)}
                style={{ cursor: " pointer" }}
              >
                {photosArrow ? <FaAngleDown /> : <FaAngleUp />}
              </div>
            </div>
            {photosArrow && (
              <div className="photos">
                {displayImages ? (
                  displayImages.map((img) => {
                    return (
                      <div className="photoItem" key={img.text}>
                        <div className="photoDetail">
                          <img
                            src={img.img}
                            alt=""
                            onClick={() => setDisplayImg(img.img)}
                          />
                          <span>{img.text}</span>
                        </div>
                        <a href={img.img} download>
                          <HiDownload />
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <p>No images shared yet</p>
                  </div>
                )}
                <div
                  className="allPhotos"
                  onClick={() => setShowAllPhotos(true)}
                >
                  Show All Photos
                </div>
              </div>
            )}
          </div>
          <div className="option">
            <div className="title">
              <p>Files Shared</p>
              <div
                className="arrow"
                onClick={(e) => setFileArrow(!fileArrow)}
                style={{ cursor: " pointer" }}
              >
                {fileArrow ? <FaAngleDown /> : <FaAngleUp />}
              </div>
            </div>
            {fileArrow && (
              <p className="light" style={{ fontWeight: 100, paddingLeft: 10 }}>
                No files added yet.
              </p>
            )}
          </div>
        </div>
        <div className="btns">
          <button onClick={handleBlock}>
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isRecieverUserBlocked
              ? "User Blocked"
              : "Blocked User"}
          </button>
          <button
            className="logout"
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {showAllPhotos && (
        <Gallery data={sharedImages} setShowAllPhotos={setShowAllPhotos} />
      )}
      {displayImg && <Image src={displayImg} setDisplayImg={setDisplayImg} />}
    </>
  );
}

export default Details;
