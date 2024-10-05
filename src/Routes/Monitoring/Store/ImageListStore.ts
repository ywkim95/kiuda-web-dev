import { create } from "zustand";
import { Image } from "../../../Common/Model/Image.model";

interface ImageListStore {
  imageList: Image[];
  setImageList: (imageList: Image[]) => void;
}

const useImageListStore = create<ImageListStore>((set) => ({
  imageList: [],
  setImageList: (imageList: Image[]) => set({ imageList }),
}));

export default useImageListStore;
