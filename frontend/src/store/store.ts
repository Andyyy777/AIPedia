import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIPediaState {
  language: string | null;
  response: string | null;
  updateLanguage: (language: string | null) => void;
  updateResponse: (response: string | null) => void;
}

export const useAIPediaStore = create<AIPediaState>()(
  persist(
    (set) => ({
      language: "",
      response: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
      neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
      quasi quidem quibusdam.`,
      updateLanguage: (newLanguage) => set(() => ({ language: newLanguage })),
      updateResponse: (newResponse) => set(() => ({ response: newResponse })),
    }),
    {
      name: "aipedia-storage",
    }
  )
);

interface ImageStore {
  selectedImage: string | null;
  setSelectedImage: (imageUrl: string | null) => void;
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      selectedImage: null,
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
  setInputText: (inputText: string) => void;
  setResponseText: (responseText: string) => void;
}

// maybe no need for persist but will decide later
export const useGPTStore = create<GPTStore>()(
  persist(
    (set) => ({
      inputText: "",
      responseText: "",
      setInputText: (inputText) => {
        set({ inputText });
      },
      setResponseText: (responseText) => {
        set({ responseText });
      },
    }),
    {
      name: "aipedia-storage",
    }
  )
);
