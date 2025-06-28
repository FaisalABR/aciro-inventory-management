import React from "react";
import ContextLayout from "./ContextLayout";
import { LoginLayout } from "./LoginLayout";
import { MainLayout } from "./MainLayout";

type TRootLayout = {
    type: "login" | "main";
    children: React.ReactNode;
    title: string;
    actions?: React.ReactNode[];
};

const RootLayout: React.FC<TRootLayout> = ({
    type,
    children,
    title,
    actions,
}) => {
    return (
        <ContextLayout>
            {type == "login" ? (
                <LoginLayout title={title}>{children}</LoginLayout>
            ) : (
                <MainLayout title={title} actions={actions}>
                    {children}
                </MainLayout>
            )}
        </ContextLayout>
    );
};

export default RootLayout;
