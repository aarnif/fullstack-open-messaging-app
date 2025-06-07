const Input = ({ item, testId }) => {
  return (
    <div className="w-full flex-grow flex flex-col p-2 border-2 border-slate-100 dark:border-slate-500 rounded-lg bg-slate-100 dark:bg-slate-500 hover:border-violet-500 focus-within:border-violet-500 transition">
      <input
        data-testid={testId}
        className="w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-800 dark:placeholder:text-slate-100 bg-slate-100 dark:bg-slate-500 focus:outline-none focus:bg-opacity-0"
        {...item}
      />
    </div>
  );
};

export default Input;
