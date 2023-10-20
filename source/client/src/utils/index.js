import data from "../messageCode.json";

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const myAlert = (messageCode) => {
  const message = data[messageCode];
  if (message) {
    alert(message);
  } else {
    alert(messageCode);
  }
};
