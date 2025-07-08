import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [content, setContent] = useState(null);

  const showModal = (component) => setContent(component);
  const hideModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {content && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex justify-center items-center ">
          <div className="bg-white  rounded-md w-full max-w-md shadow-xl relative">
            <button
              className="absolute bg-gray-300 rounded-md w-6 h-8 top-3 right-3 text-gray-600 text-2xl"
              onClick={hideModal}
            >
              &times;
            </button>
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
