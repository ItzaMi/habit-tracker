'use client';
import { Plus } from 'lucide-react';
import { FC, useRef } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  action: (formData: FormData) => void;
}

const Form: FC<Props> = ({ action }) => {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <p className="text-xs font-bold">Start a new habit</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-3 w-3 items-center justify-center rounded-full bg-black text-[8px] text-white">
                ?
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] " side="right">
              <p className="text-xs">
                Think hard about what you want to achieve!
                <br />
                <strong>
                  Once you create an habit and 48 hours pass, you no longer will
                  be able to delete it.
                </strong>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
    </div>
  );
};

export default Form;
