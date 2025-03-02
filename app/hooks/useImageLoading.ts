import { useState, useEffect } from "react";

export function useImageLoading(imagePath: string) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Check if image was previously loaded
    const cachedLoadState = localStorage.getItem(`img_loaded_${imagePath}`);
    if (cachedLoadState === "true") {
      setImageLoaded(true);
    }
  }, [imagePath]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Cache the load state
    localStorage.setItem(`img_loaded_${imagePath}`, "true");
  };

  return {
    imageLoaded,
    handleImageLoad,
  };
}
