import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VoteDisabled {
  disabled: string[];
  setDisabled: (state: string) => void;
  votes: { token: string; optionID: number }[];
  setVotes: (token: string, optionID: number) => void;
}

const initialData: Partial<VoteDisabled> = {
  disabled: [],
};

const useVoteDisabledStore = create<Partial<VoteDisabled>>()(
  persist(
    (set) => ({
      ...initialData,
      setDisabled: (state) =>
        set((prev) => ({
          disabled: [...(prev.disabled || []), state],
        })),
      setVotes: (token, optionID) =>
        set((prev) => ({
          votes: [...(prev.votes || []), { token, optionID }],
        })),
    }),
    {
      name: "vote-disabled-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useVoteDisabledStore;
