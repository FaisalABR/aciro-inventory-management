import React from "react";
import { Button, Col, Flex, Form, Input, Row, Select, Typography } from "antd";
import { Link, router } from "@inertiajs/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Route } from "../Common/Route";
import RootLayout from "../Layouts/RootLayout";

const Register: React.FC = ({ data }: { data: any }) => {
    const [form] = Form.useForm();

    const onSubmit = async (values: any) => {
        try {
            router.post(Route.AuthRegister, values);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <RootLayout title="Register" type="login">
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
                                Silahkan daftar terlebih dahulu
                            </Typography.Title>
                        </Col>
                        <Col>
                            <Typography.Title
                                level={3}
                                style={{ fontWeight: "bold" }}
                            >
                                Register
                            </Typography.Title>
                        </Col>
                    </Flex>

                    <Form
                        form={form}
                        onFinish={onSubmit}
                        style={{ marginTop: "2rem" }}
                        layout="vertical"
                    >
                        <Form.Item name="name" label="Nama">
                            <Input placeholder="Faisal Abu Bakar Riza" />
                        </Form.Item>
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
                        <Form.Item
                            name="password_confirmation"
                            label="Konfirmasi Password"
                        >
                            <Input.Password
                                placeholder="********"
                                prefix={<LockOutlined />}
                                autoComplete="current-password"
                            />
                        </Form.Item>
                        <Form.Item name="noWhatsapp" label="No Whatsapp">
                            <Input placeholder="+6282213213" />
                        </Form.Item>
                        <Form.Item name="role_id" label="Role">
                            <Select
                                options={data.options}
                                placeholder="kepala_toko"
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ fontWeight: "bold", width: "100%" }}
                        >
                            Daftar
                        </Button>
                        <Col
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                            }}
                        >
                            Sudah punya akun?{"  "}
                            <Link href={Route.AuthLogin}>Login</Link>
                        </Col>
                    </Form>
                </Col>
            </Row>
        </RootLayout>
    );
};

export default Register;
