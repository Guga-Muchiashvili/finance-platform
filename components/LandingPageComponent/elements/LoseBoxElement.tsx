import React from "react";

const LoseBoxElement = ({
  title,
  type,
  amount,
  date,
  status,
}: {
  title: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}) => {
  return (
    <div className="w-full px-7 flex items-center text-lg justify-between h-16 rounded-xl mt-3 bg-white border-blue-600 border-[1px] bg-opacity-70">
      <h1 className="w-1/4 text-center">{title}</h1>
      <h1 className="w-1/4 text-center">{type}</h1>
      <h1 className="w-1/4 text-center">{amount}$</h1>
      <h1 className="w-1/4 text-center">{date}</h1>
      <div className="w-1/4 flex items-center justify-center">
        <button className="text-white px-4 bg-blue-600 py-1 rounded-xl">
          {status}
        </button>
      </div>
    </div>
  );
};

export default LoseBoxElement;
