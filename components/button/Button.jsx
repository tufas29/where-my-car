"use client";
import style from "./button.module.css";

const Button = ({ item, handleClick }) => {
  return (
    <button
      className={`${style.button} ${item.active ? style.active : ""}`}
      onClick={() => handleClick(item)}
    >
      {item.location}
    </button>
  );
};

export default Button;
