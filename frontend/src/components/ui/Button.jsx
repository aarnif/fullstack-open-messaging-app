const Button = ({ type, name, testId, text, onClick }) => {
  const buttonStyles = {
    "sign-in":
      "py-3 text-base sm:text-lg font-bold text-white bg-green-500 border-2 border-green-500 rounded-xl hover:bg-green-600 focus:bg-green-600 active:scale-95 transition",
    "sign-up":
      "py-3 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 border-2 border-slate-400 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-900 focus:bg-slate-300 active:scale-95 transition",
  };

  return (
    <button
      type={type}
      data-testid={testId}
      onClick={onClick}
      className={buttonStyles[name]}
    >
      {text}
    </button>
  );
};

export default Button;
