import React from "react";

const ConfirmationModal = ({
  deleteFunction,
  close,
  title,
}: {
  deleteFunction: () => void;
  close: () => void;
  title: string;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6">
        <h1 className="text-2xl">{title}?</h1>
        <div className="flex gap-4 mt-4 justify-end">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
            onClick={deleteFunction}
          >
            Yes, Delete
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded-xl" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
