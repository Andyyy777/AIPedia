import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIPediaState {
  language: string | null;
  response: string | null;
  userStatus: string | null;
  updateLanguage: (language: string | null) => void;
  updateResponse: (response: string | null) => void;
  updateUserStatus: (userStatus: string | null) => void;
}

export const useAIPediaStore = create<AIPediaState>()(
  persist(
    (set) => ({
      language: "",
      response: ``,
      userStatus: "",
      updateLanguage: (newLanguage) => set(() => ({ language: newLanguage })),
      updateResponse: (newResponse) => set(() => ({ response: newResponse })),
      updateUserStatus: (newUserStatus) => set(() => ({ userStatus: newUserStatus })),
    }),
    {
      name: "aipedia-storage",
    }
  )
);

interface ImageStore {
  firstUploaded:boolean;
  selectedImage: string | null;
  setFirstUploaded: (firstUploaded: boolean) => void;
  setSelectedImage: (imageUrl: string | null) => void;
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      firstUploaded:false,
      selectedImage: null,
      setFirstUploaded: (firstUploaded) => {
        set({ firstUploaded: firstUploaded });
      },
      setSelectedImage: (imageUrl) => {
        set({ selectedImage: imageUrl });
      },
    }),
    {
      name: "aipedia-storage",
    }
  )
);

interface AnchorStore {
  anchor: HTMLElement | null;
  selectedOption: string | null;
  setAnchor: (anchor: HTMLElement | null) => void;
  setSelectedOption: (selectedOption: string | null) => void;
}

export const useAnchorStore = create<AnchorStore>()((set) => ({
  anchor: null,
  selectedOption: null,
  setAnchor: (anchor) => {
    set({ anchor: anchor });
  },
  setSelectedOption: (selectedOption) => {
    set({ selectedOption: selectedOption });
  },
}));

interface GPTStore {
  inputText: string;
  responseText: string;
  isProcessing: boolean;
  setInputText: (inputText: string) => void;
  setResponseText: (responseText: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

// maybe no need for persist but will decide later
export const useGPTStore = create<GPTStore>()(
  persist(
    (set) => ({
      inputText: "",
      responseText: "",
      isProcessing: false,
      setInputText: (inputText) => {
        set({ inputText });
      },
      setResponseText: (responseText) => {
        set({ responseText });
      },
      setIsProcessing: (isProcessing) => set(() => ({ isProcessing })),
    }),
    {
      name: "aipedia-storage",
    }
  )
);

interface ContextStore {
  context: string | null;
  setContext: (inputText: string | null) => void;
}

export const useContextStore = create<ContextStore>()(
  persist(
    (set) => ({
      context: null,
      setContext: (context) => {
        set({ context });
      }
    }),
    {
      name: "aipedia-storage",
    }
  )
);

export type ConversationMessage = {
  speaker: string;
  text: string;
};

interface ConversationStore {
  conversation: ConversationMessage[];
  setConversation: (conversation: ConversationMessage[]) => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      conversation: [],
      setConversation: (conversation) => {
        set({ conversation });
      }
    }),
    {
      name: "aipedia-storage",
    }
  )
);