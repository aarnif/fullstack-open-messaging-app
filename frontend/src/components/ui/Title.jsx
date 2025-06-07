const Title = ({ type, text }) => {
  const titles = {
    primary: (
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        {text}
      </h1>
    ),
  };

  return titles[type];
};

export default Title;
