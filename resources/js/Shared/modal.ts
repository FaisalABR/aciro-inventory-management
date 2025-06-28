import { Modal, ModalFuncProps } from "antd";

export const useModal = (props: ModalFuncProps) => {
    if (!props.type) {
        return;
    }

    return Modal[props.type]({
        ...props,
    });
};
