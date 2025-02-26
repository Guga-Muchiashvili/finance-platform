import React from "react";

const WorkerBoxElement = ({
  type,
  amount,
  name,
  active,
}: {
  type: string;
  amount: string;
  name: string;
  active: boolean;
}) => {
  return (
    <div className="w-full px-7 flex items-center text-xl justify-between h-16 rounded-xl mt-3 bg-white border-blue-600 border-[1px] bg-opacity-70">
      <h1 className="w-1/4 text-center">{type}</h1>
      <h1 className="w-1/4 text-center">{name}</h1>
      <h1 className="w-1/4 text-center">{amount}$</h1>
      <div className="w-1/4 flex items-center justify-center">
        <button
          className={`text-white px-4 bg-green-600 py-1 rounded-xl text-center ${
            active ? "bg-green-600" : "bg-red-500"
          } `}
        >
          {active ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
};

export default WorkerBoxElement;
