const Title = ({ variant, testId, text }) => {
  const titles = {
    primary: (
      <h1
        data-testid={testId}
        className="text-xl font-bold text-slate-800 dark:text-slate-100"
      >
        {text}
      </h1>
    ),
  };

  return titles[variant];
};

export default Title;
