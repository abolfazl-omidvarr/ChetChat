import { SearchedUsers } from '@/util/types';
import { create } from 'zustand';

interface ConversationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  participants: Array<SearchedUsers>;
  addParticipant: (user: SearchedUsers) => void;
  removeParticipant: (user: SearchedUsers) => void;
}

const useConversationModal = create<ConversationModalStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  //////////
  participants: [],
  addParticipant: (user: SearchedUsers) =>
    set((state) => {
      const exist = state.participants.some((elem) => elem.id === user.id);
      if (exist) return state;
      return { participants: [...state.participants, user] };
    }),
  removeParticipant: (user: SearchedUsers) =>
    set((state) => ({
      participants: state.participants.filter((elem) => elem.id !== user.id),
    })),
  ///////
}));

export default useConversationModal;
