import { Head } from "@inertiajs/react";
import { Col, Layout, Row } from "antd";
import React from "react";

type TLoginLayout = {
    children: React.ReactNode;
    title: string;
};

const { Content } = Layout;

export const LoginLayout: React.FC<TLoginLayout> = ({ children, title }) => {
    return (
        <>
            <Head title={`${title} | Aciro Inventory Management`} />
            <Layout style={{ minHeight: "100vh" }}>
                <Content style={{ display: "flex" }}>
                    <Row style={{ width: "100%" }}>
                        <Col span={12}>
                            <div
                                style={{
                                    minHeight: "100vh",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src="/img/toko-aciro.webp"
                                    width={"100%"}
                                    height={"100vh"}
                                    style={{
                                        position: "absolute",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        height: "100%",
                                    }}
                                />
                                <img
                                    src="/img/logo-aciro.png"
                                    width={"40%"}
                                    alt="logo aciro"
                                    style={{
                                        position: "absolute",
                                        top: "2rem",
                                        left: "2rem",
                                    }}
                                />
                            </div>
                        </Col>
                        <Col span={12}>{children}</Col>
                    </Row>
                </Content>
            </Layout>
        </>
    );
};
