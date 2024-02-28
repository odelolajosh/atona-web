import { useState } from "react";

type Modal<T> = {
  type: T;
  data: any;
};

export type ModalProps<T> = Modal<T>;

export const useModal = <T>() => {
  const [modal, setModal] = useState<Modal<T> | null>(null);

  const openModal = (type: T, data: any) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal(null);
  };

  const modalProps = (type: T) => {
    return {
      open: modal?.type === type,
      onOpenChange: (open: boolean) => {
        if (!open) {
          closeModal();
        }
      }
    };
  };

  return {
    modal,
    openModal,
    closeModal,
    modalProps
  };
}