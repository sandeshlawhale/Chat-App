import { RiLockPasswordLine } from "react-icons/ri";
import "./login.scss";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { uploadImage } from "../../lib/uploadImage";
import { doc, setDoc } from "firebase/firestore";

function Login() {
  // show and hide the password (login, register and confirm password)
  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  // const [imgUploading, setImgUploading] = useState(false);
  // const [imgUrl, setImgUrl] = useState("");
  // const [avatar, setAvatar] = useState({
  //   file: null,
  //   url: "",
  // });
  // const handleAvatar = async (e: any) => {
  //   if (e.target.files[0]) {
  //     setAvatar({
  //       file: e.target.files[0],
  //       url: URL.createObjectURL(e.target.files[0]),
  //     });
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, password, email, confirmPassword } =
      Object.fromEntries(formData);

    try {
      if (confirmPassword === password) {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        // if (avatar.file) {
        //   setImgUploading(true);
        //   const img = await uploadImage(avatar.file);

        //   setImgUrl(img);
        //   console.log(imgUrl);
        //   console.log(img);
        // }
        await setDoc(doc(db, "users", res?.user?.uid), {
          username,
          email,
          bio: "",
          handle: "",
          link: "",
          avatar: "",
          id: res?.user?.uid,
          blocked: [],
        });

        await setDoc(doc(db, "userchat", res?.user?.uid), {
          chats: [],
        });

        toast.success("Account Created!");
      } else {
        toast.error("Password and Confirm Password should be same.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setImgUploading(false);
      setLoading(false);
    }
  };

  // useEffect(async () => {
  //   console.log(imgUrl);
  //   await setDoc(doc(db, "users", res?.user?.uid), {
  //     avatar: imgUrl
  //   }
  // }, [imgUrl]);

  return (
    <div className="login-container">
      {/* login page */}
      <div className="login">
        <div className="wrapper">
          <span>Welcome Back!</span>
          <p>Login User</p>
          <form onSubmit={handleLogin}>
            <div className="email inputField">
              <MdOutlineEmail />
              <input type="email" placeholder="Email" name="email" />
            </div>
            <div className="password inputField">
              <RiLockPasswordLine />
              <input
                type={loginShow ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              <div
                className="eye"
                onClick={() => {
                  setLoginShow((prev) => !prev);
                }}
              >
                {loginShow ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <button type="submit" disabled={loginLoading}>
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="seperator"></div>

      {/* register page */}
      <div className="register login">
        <div className="wrapper">
          <span>New to the App!</span>
          <p>Register User</p>
          <form onSubmit={handleRegister}>
            {/* <div className="avatar inputField">
              <img src={avatar.url || "/avatar.png"} alt="" />
              <label htmlFor="avatar">Upload an Avatar</label>
              <input type="file" id="avatar" onChange={handleAvatar} />
              {imgUploading && <BiLoaderAlt />}
            </div> */}
            <div className="username inputField">
              <FaRegUser />
              <input type="text" placeholder="username" name="username" />
            </div>
            <div className="email inputField">
              <MdOutlineEmail />
              <input type="email" placeholder="Email" name="email" />
            </div>
            <div className="password inputField">
              <RiLockPasswordLine />
              <input
                type={registerShow ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              <div
                className="eye"
                onClick={() => {
                  setRegisterShow((prev) => !prev);
                }}
              >
                {registerShow ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <div className="password inputField">
              <RiLockPasswordLine />
              <input
                type={confirmShow ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
              />
              <div
                className="eye"
                onClick={() => {
                  setConfirmShow((prev) => !prev);
                }}
              >
                {confirmShow ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Creating User" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
