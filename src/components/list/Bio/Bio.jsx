import { IoMdClose } from "react-icons/io";
import "./bio.scss";
import { useUserStore } from "../../../lib/userStore";
import { MdOutlineChangeCircle } from "react-icons/md";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { uploadImage } from "../../../lib/uploadImage";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { linkWithRedirect } from "firebase/auth";

function Bio({ setBio }) {
  const { currentUser } = useUserStore();
  const [imgLoading, setImgLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = async (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      toast.info("Click the save to update the changes.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let { bioData, handleData, linkData } = Object.fromEntries(formData);

    try {
      const userDataSanp = await getDoc(doc(db, "users", currentUser.id));
      const userData = userDataSanp.data();
      const { bio, handle, link } = userData;
      if (bioData === "") {
        if (bio === "") {
          bioData = "";
        } else {
          bioData = bio;
        }
      }
      if (handleData === "") {
        if (handle === "") {
          handleData = "";
        } else {
          handleData = handle;
        }
      }
      if (linkData === "") {
        if (link === "") {
          linkData = "";
        } else {
          linkData = link;
        }
      }

      await updateDoc(doc(db, "users", currentUser.id), {
        bio: bioData,
        handle: handleData,
        link: linkData,
      });
      if (avatar.file) {
        setImgLoading(true);
        const imgUrl = await uploadImage(avatar.file);

        await updateDoc(doc(db, "users", currentUser.id), {
          avatar: imgUrl,
        });
        setImgLoading(false);
      }
      toast.success("Changes Updated! you can refresh now");
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = async () => {
    setImgLoading(true);
    await updateDoc(doc(db, "users", currentUser.id), {
      avatar: "",
    });
    setImgLoading(false);
    toast.success("Profile Picture is removed. You can refresh now");
  };

  return (
    <div className="bioContainer">
      <div className="avatar">
        <IoMdClose className="cross" onClick={() => setBio((prev) => !prev)} />
        <div className="img">
          <img src={currentUser.avatar || "./avatar.png"} alt="" />
          {imgLoading && <div className="shadders"></div>}
          {imgLoading && <BiLoaderAlt />}
        </div>
        <div className="btns">
          <label
            htmlFor="imgFile"
            title="Change the profile picture"
            className="button"
          >
            Change <MdOutlineChangeCircle />
          </label>
          <input
            type="file"
            name="imgFile"
            id="imgFile"
            onChange={handleAvatar}
            style={{ display: "none" }}
          />
          <button
            title="Remove the profile picture"
            className=" button remove"
            onClick={handleRemove}
          >
            Remove <IoMdClose />
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            readOnly={true}
            style={{ cursor: "not-allowed" }}
            value={currentUser.username}
          />
        </div>
        <div className="input">
          <label htmlFor="bioData">Bio</label>
          <input
            type="text"
            name="bioData"
            placeholder={currentUser.bio || "Type your bio.."}
          />
        </div>
        <div className="input">
          <label htmlFor="handleData">Handle</label>
          <input
            type="text"
            name="handleData"
            placeholder="instagram/github/linkedIn"
          />
        </div>
        <div className="input">
          <label htmlFor="linkData">Handle Link</label>
          <input
            type="text"
            name="linkData"
            placeholder="link of your social handle..."
          />
        </div>
        <button disabled={imgLoading}>Save</button>
      </form>
    </div>
  );
}

export default Bio;
