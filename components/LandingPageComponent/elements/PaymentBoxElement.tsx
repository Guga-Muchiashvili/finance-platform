import React from "react";

const PaymentBoxElement = ({
  type,
  amount,
  ourShare,
  date,
  status,
}: {
  type: string;
  amount: string;
  ourShare: string;
  date: string;
  status: string;
}) => {
  return (
    <div className="w-full px-7 flex items-center text-xl justify-between h-16 rounded-xl mt-3 bg-white border-blue-600 border-[1px] bg-opacity-70">
      <h1 className="w-1/4 text-center">{type}</h1>
      <h1 className="w-1/4 text-center">{amount}$</h1>
      <h1 className="w-1/4 text-center"> {ourShare}$</h1>
      <h1 className="w-1/4 text-center"> {date}</h1>
      <div className="w-1/4 flex items-center justify-center">
        <button
          className={`text-white px-4 bg-green-600 py-1 rounded-xl text-center ${
            status === "completed"
              ? "bg-green-600"
              : status === "hold"
              ? "bg-red-600"
              : status === "balance"
              ? "bg-yellow-600"
              : "bg-blue-600"
          } `}
        >
          {status}
        </button>
      </div>
    </div>
  );
};

export default PaymentBoxElement;
