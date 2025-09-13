import { usePage } from "@inertiajs/react";
import React, { createContext, useContext, useEffect } from "react";
import { TInertiaProps } from "../Types/intertia";
import { notification } from "antd";
import { ArgsProps } from "antd/es/notification";

type TMessageProviderProps = {
    children: React.ReactNode;
};

type TNotifData = ArgsProps;

type TMessageContext = {
    notif: (data: TNotifData) => void;
    notifDestroy: () => void;
};

const MessageContext = createContext<TMessageContext | null>(null);

const MessageProvider: React.FC<TMessageProviderProps> = ({ children }) => {
    const { flash } = usePage<TInertiaProps>().props;
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

    useEffect(() => {
        if (flash.success) {
            notif({
                message: flash.success,
                type: "success",
            });
        }

        if (flash.error) {
            notif({
                message: flash.error,
                type: "error",
            });
        }
    }, [flash]);

    const contextValue = {
        notif,
        notifDestroy: (): void => api.destroy(),
    };

    return (
        <MessageContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessages must be used within a MessageProvider");
    }
    return context;
};
