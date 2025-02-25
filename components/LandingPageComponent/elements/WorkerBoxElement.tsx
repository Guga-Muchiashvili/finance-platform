import React from "react";

const WorkerBoxElement = ({
  type,
  amount,
  name,
}: {
  type: string;
  amount: string;
  name: string;
}) => {
  return (
    <div className="w-full px-7 flex items-center text-xl justify-between h-16 rounded-xl mt-3 bg-white border-blue-600 border-[1px] bg-opacity-70">
      <h1 className="w-1/3 text-center">{type}</h1>
      <h1 className="w-1/3 text-center">{name}</h1>
      <h1 className="w-1/3 text-center">{amount}$</h1>
    </div>
  );
};

export default WorkerBoxElement;
