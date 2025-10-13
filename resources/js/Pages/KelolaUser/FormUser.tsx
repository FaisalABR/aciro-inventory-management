import React, { useState } from "react";
import { Button, Card, Flex, Form, Input, Select } from "antd";
import Title from "antd/es/typography/Title";
import { router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { createSchemaFieldRule } from "antd-zod";
import { CreateUserSchema, EditUserSchema } from "../../Shared/validation";
import RootLayout from "../../Layouts/RootLayout";
import { TUser } from "../../Types/entities";
import { LoadingOutlined } from "@ant-design/icons";

type TUserFormProps = {
    isUpdate: boolean;
    data: TUser;
};

const FormUser: React.FC<TUserFormProps> = (props) => {
    const zodSync = createSchemaFieldRule(
        props.isUpdate ? EditUserSchema : CreateUserSchema,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            setIsLoading(true);
            props.isUpdate && props.data?.uuid
                ? router.put(
                      route(Route.EditUser, {
                          uuid: props.data.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreateUser, values);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.KelolaUser);
    };

    return (
        <RootLayout
            type="main"
            title={props.isUpdate ? "Edit Pengguna" : "Tambah Pengguna"}
        >
            <Card>
                <Flex vertical style={{ width: "30%", marginInline: "auto" }}>
                    <Title level={4}>
                        {props.isUpdate
                            ? "Form Edit Pengguna"
                            : "Form Tambah Pengguna"}
                    </Title>
                    <Form
                        form={form}
                        initialValues={{
                            ...props.data,
                            roles: props.data?.roles?.find((item) => item.id)
                                ?.id,
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ marginTop: "0.5rem" }}
                    >
                        <Form.Item rules={[zodSync]} name="email" label="Email">
                            <Input
                                placeholder="faisal@aciro.id"
                                autoComplete="email"
                            />
                        </Form.Item>
                        <Form.Item rules={[zodSync]} name="name" label="Nama">
                            <Input placeholder="Faisal Abu Bakar Riza" />
                        </Form.Item>
                        {!props.isUpdate && (
                            <Form.Item
                                rules={[zodSync]}
                                name="password"
                                label="Password"
                            >
                                <Input placeholder="*****" />
                            </Form.Item>
                        )}
                        <Form.Item
                            rules={[zodSync]}
                            name="noWhatsapp"
                            label="Nomor Whatsapp"
                        >
                            <Input placeholder="082216386576" />
                        </Form.Item>
                        <Form.Item rules={[zodSync]} name="roles" label="Roles">
                            <Select
                                options={[
                                    {
                                        value: 2,
                                        label: "Kepala Toko",
                                    },
                                    {
                                        value: 3,
                                        label: <span>Kepala Gudang</span>,
                                    },
                                    {
                                        value: 4,
                                        label: <span>Kepala Accounting</span>,
                                    },
                                    {
                                        value: 5,
                                        label: <span>Kepala Pengadaan</span>,
                                    },
                                    {
                                        value: 6,
                                        label: <span>Admin Gudang</span>,
                                    },
                                    {
                                        value: 7,
                                        label: <span>Staff Toko</span>,
                                    },
                                    {
                                        value: 9,
                                        label: <span>Staff Accounting</span>,
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Flex gap="small">
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={isLoading}
                                style={{ fontWeight: "medium" }}
                            >
                                {isLoading ? <LoadingOutlined /> : "Submit"}
                            </Button>
                            <Button onClick={onReset}>Batal</Button>
                        </Flex>
                    </Form>
                </Flex>
            </Card>
        </RootLayout>
    );
};

export default FormUser;
