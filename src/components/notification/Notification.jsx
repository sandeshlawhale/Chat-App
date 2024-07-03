import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

function Notification() {
  return (
    <div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default Notification;
