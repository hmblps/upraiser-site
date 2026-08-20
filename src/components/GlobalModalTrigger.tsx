import { useEffect } from "react";
import { useModalBackground } from "../lib/modalBackgroundState";

export function GlobalModalTrigger() {
  const { openModalBg, closeModalBg } = useModalBackground();
  
  useEffect(() => {
    openModalBg();
    return () => closeModalBg();
  }, [openModalBg, closeModalBg]);
  
  return null;
}
