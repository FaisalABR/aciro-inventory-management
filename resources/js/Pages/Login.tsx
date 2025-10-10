import React from "react";
import { Button, Col, Flex, Form, Input, Row, Typography } from "antd";
import { Link, router } from "@inertiajs/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Route } from "../Common/Route";
import RootLayout from "../Layouts/RootLayout";

const Login: React.FC = () => {
    const [form] = Form.useForm();

    const onSubmit = async (values: any) => {
        try {
            router.post(Route.AuthLogin, values);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <RootLayout title="Login" type="login">
            <Row
                align="middle"
                justify="center"
                style={{
                    height: "100%",
                    width: "50%",
                    margin: "0px auto",
                }}
            >
                <Col span={24}>
                    <Flex align="start" vertical>
                        <Col>
                            <Typography.Title
                                level={4}
                                style={{ fontWeight: "lighter" }}
                            >
                                Selamat Datang di
                            </Typography.Title>
                        </Col>
                        <Col>
                            <Typography.Title
                                level={3}
                                style={{ fontWeight: "bold" }}
                            >
                                Aciro Inventory Management
                            </Typography.Title>
                        </Col>
                    </Flex>

                    <Form
                        form={form}
                        onFinish={onSubmit}
                        style={{ marginTop: "2rem" }}
                        layout="vertical"
                    >
                        <Form.Item name="email" label="Email">
                            <Input
                                placeholder="faisal@aciro.id"
                                prefix={<MailOutlined />}
                                autoComplete="email"
                            />
                        </Form.Item>
                        <Form.Item name="password" label="Password">
                            <Input.Password
                                placeholder="********"
                                prefix={<LockOutlined />}
                                autoComplete="current-password"
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ fontWeight: "bold", width: "100%" }}
                        >
                            Login
                        </Button>
                        <Col
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                            }}
                        >
                            Belum punya akun?{"  "}
                            <Link href={Route.AuthRegister}>Buat Akun</Link>
                        </Col>
                    </Form>
                </Col>
            </Row>
        </RootLayout>
    );
};

export default Login;
