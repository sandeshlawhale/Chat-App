import { IoMdClose } from "react-icons/io";
import "./gallery.scss";
import Image from "../image/Image";
import { useState } from "react";

function Gallery({ data, setShowAllPhotos }) {
  const [displayImg, setDisplayImg] = useState("");
  return (
    <>
      <div className="galleryContainer">
        <div className="head">
          <h2>Gallery</h2>
          <IoMdClose
            className="cross"
            onClick={() => setShowAllPhotos((prev) => !prev)}
          />
        </div>
        <div className="items">
          {data?.map((img, index) => {
            return (
              <div className="item" key={`${img.text}_${index}`}>
                <img
                  src={img.img}
                  alt=""
                  onClick={() => setDisplayImg(img.img)}
                />
              </div>
            );
          })}
        </div>
      </div>
      {displayImg && <Image src={displayImg} setDisplayImg={setDisplayImg} />}
    </>
  );
}

export default Gallery;
