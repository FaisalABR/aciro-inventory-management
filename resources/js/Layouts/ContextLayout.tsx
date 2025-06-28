import React from "react";
import MessageProvider from "../Context/MessageContext";

type TContextLayoutProps = {
    children: React.ReactNode;
};

const ContextLayout: React.FC<TContextLayoutProps> = ({ children }) => {
    return <MessageProvider>{children}</MessageProvider>;
};

export default ContextLayout;
