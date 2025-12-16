"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
}

const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-60 backdrop-blur-md">
      {/* Modal Container with Smaller Height */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-[90%] md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
          {title}
        </h2>

        {/* Modal Content */}
        <div className="text-gray-700 text-lg space-y-3 leading-relaxed text-left">
          {content.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>

        {/* Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-color1 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Fade-In Animation (CSS) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Modal;
