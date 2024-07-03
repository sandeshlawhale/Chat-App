import "./more.scss";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";

function More({ setBio }) {
  const { currentUser } = useUserStore();

  return (
    <div className="moreContainer">
      <img src={currentUser.avatar || "/avatar.png"} alt="" />
      <div className="detail">
        <p className="name">{currentUser.username}</p>
        <span>{currentUser.bio}</span>
        {currentUser.handle && currentUser.link && (
          <p className="handle">
            {currentUser.handle}:
            <a href={currentUser.link}>{currentUser.link}</a>
          </p>
        )}
      </div>
      <button
        className="logout"
        onClick={() => {
          auth.signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default More;
