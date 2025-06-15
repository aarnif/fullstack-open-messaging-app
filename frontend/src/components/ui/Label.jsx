const Label = ({ title }) => {
  return (
    <label className="text-mobile sm:text-base font-medium text-slate-700 dark:text-slate-200">
      {title.toUpperCase()}:
    </label>
  );
};

export default Label;
