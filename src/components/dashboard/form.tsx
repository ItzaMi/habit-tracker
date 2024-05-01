"use client";
import { FC, useRef } from "react";

interface Props {
  action: (formData: FormData) => void;
}

const Form: FC<Props> = ({ action }) => {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      className="flex flex-row gap-1 items-center text-sm justify-between border-2 border-slate-200 px-4 py-2 rounded-lg"
      ref={ref}
      action={(formData) => {
        action(formData);
        ref.current?.reset();
      }}
    >
      <input
        id="habit"
        type="text"
        name="habit"
        placeholder="Habit name"
        className="outline-none w-full"
      />
      <button
        type="submit"
        className="font-bold py-1 rounded-full px-4 cursor-pointer bg-slate-200 flex-shrink-0"
      >
        Add habit
      </button>
    </form>
  );
};

export default Form;
