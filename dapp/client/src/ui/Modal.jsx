import { useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { FaTimesCircle } from "react-icons/fa";

const useBodyScrollLock = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [isOpen]);
};

const Modal = ({ isOpen, onClose, children }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded bg-white p-4">
        <button
          className="absolute right-0 top-0 p-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimesCircle className="mt-2 h-6 w-6 text-red-700 transition-all duration-300 hover:text-red-500" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
