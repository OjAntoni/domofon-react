import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ImageContextType {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  newMsgs: number;
  setNewMsgs: (n: number) => void;
}

const defaultValue: ImageContextType = {
  imageUrl: "",
  setImageUrl: () => {},
  newMsgs: 0,
  setNewMsgs: () => {},
};

const ImageContext = createContext<ImageContextType>(defaultValue);

export const useImageContext = () => useContext(ImageContext);

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  // Initialize imageUrl state from localStorage if available
  const [imageUrl, setImageUrl] = useState<string>(() => {
    return localStorage.getItem("imageUrl") || defaultValue.imageUrl;
  });
  const [newMsgs, setNewMsgs] = useState<number>(0);

  // Effect to update localStorage whenever imageUrl changes
  useEffect(() => {
    localStorage.setItem("imageUrl", imageUrl);
  }, [imageUrl]);

  return (
    <ImageContext.Provider
      value={{ imageUrl, setImageUrl, newMsgs, setNewMsgs }}
    >
      {children}
    </ImageContext.Provider>
  );
};
