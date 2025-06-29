import { Modal, ModalFuncProps, notification } from "antd";
import { ArgsProps } from "antd/es/notification";

type TNotifData = ArgsProps;

export const useNotification = () => {
    const [api, contextHolder] = notification.useNotification();

    const notif = (data: TNotifData): void => {
        api.open({
            ...data,
            type: data.type,
            message: data.message,
            description: data.description,
            duration: 3,
            placement: "top",
            key: "global-notification",
        });
    };

    return {
        notif,
        contextHolder,
        notifDestroy: (): void => api.destroy(),
    };
};

export const useModal = (props: ModalFuncProps) => {
    if (!props.type) {
        return;
    }

    return Modal[props.type]({
        ...props,
    });
};
