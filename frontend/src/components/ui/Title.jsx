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
    secondary: (
      <h2
        data-testid={testId}
        className="text-lg font-bold text-slate-800 dark:text-slate-100"
      >
        {text}
      </h2>
    ),
    tertiary: (
      <h3
        data-testid={testId}
        className="text-base font-bold text-slate-800 dark:text-slate-100"
      >
        {text}
      </h3>
    ),
  };

  return titles[variant];
};

export default Title;
