import {create} from "zustand"
import { persist } from 'zustand/middleware'

interface ImageStore {
    selectedImage: string | null;
    setSelectedImage:(imageUrl: string | null) => void;
}

export const useImageStore = create<ImageStore>()(
    persist((set) => ({
    selectedImage: null,
    setSelectedImage: (imageUrl)=>{
        set({selectedImage: imageUrl})
    }
    }),
{
    name: 'aipedia-storage',
  },));