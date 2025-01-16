import React from "react";

const LoseBoxElement = () => {
  return (
    <div className="w-full px-7 flex items-center text-lg justify-between h-12 rounded-xl mt-3 bg-white border-blue-600 border-[1px] bg-opacity-70">
      <h1 className="w-1/4 text-center">Bumpy supscriotion</h1>
      <h1 className="w-1/4 text-center">model</h1>
      <h1 className="w-1/4 text-center">120$</h1>
      <div className="w-1/4 flex items-center justify-center">
        <button className="text-white px-4 bg-blue-600 py-1 rounded-xl">
          supscirtion
        </button>
      </div>
    </div>
  );
};

export default LoseBoxElement;
