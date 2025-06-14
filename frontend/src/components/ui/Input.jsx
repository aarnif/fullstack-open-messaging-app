const Input = ({ item, testId, icon = <></> }) => {
  const { setValue, ...inputProps } = item;
  return (
    <div className="w-full flex justify-between items-center gap-2 p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
      {icon}
      <input
        data-testid={testId}
        className="w-full text-mobile lg:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
        {...inputProps}
      />
    </div>
  );
};

export default Input;
