'use client';
import { Plus } from 'lucide-react';
import { FC, useRef } from 'react';

interface Props {
  action: (formData: FormData) => void;
}

const Form: FC<Props> = ({ action }) => {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      className="flex flex-row items-center justify-between gap-1"
      ref={ref}
      action={(formData) => {
        action(formData);
        ref.current?.reset();
      }}
    >
      <div className="flex h-10 w-full items-center rounded-lg border-2  border-slate-200 px-4 text-sm">
        <input
          id="habit"
          type="text"
          name="habit"
          placeholder="Habit name"
          className="w-full outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-slate-white flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-slate-200 hover:border-slate-100"
      >
        <Plus size={12} />
      </button>
    </form>
  );
};

export default Form;
