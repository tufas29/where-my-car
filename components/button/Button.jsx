import style from "./button.module.css";

const Button = ({ location, active }) => {
  return (
    <button className={`${style.button} ${active ? style.active : ""}`}>
      {location}
    </button>
  );
};

export default Button;
