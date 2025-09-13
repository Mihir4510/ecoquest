import React from "react";

const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button
      type={type} // ensures form submit works when type="submit"
      onClick={onClick}
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={text.includes("Registering") || text.includes("Logging in")}
    >
      {text}
    </button>
  );
};

export default Button;
