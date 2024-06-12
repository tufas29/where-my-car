import style from "./button.module.css";

const Button = ({ location, active }) => {
  const handleClick = () => {};

  return (
    <button
      className={`${style.button} ${active ? style.active : ""}`}
      onClick={handleClick}
    >
      {location}
    </button>
  );
};

export default Button;
