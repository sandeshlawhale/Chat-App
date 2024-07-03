import { IoMdClose } from "react-icons/io";
import "./image.scss";

function Image({ src, setDisplayImg }) {
  return (
    <div className="imgContainer">
      <IoMdClose onClick={() => setDisplayImg("")} />
      <img src={src} alt="" />
    </div>
  );
}

export default Image;
