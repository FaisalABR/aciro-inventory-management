import React, { useState } from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { TSupplier } from "../../../Types/entities";
import { Button, Card, Flex, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import { createSchemaFieldRule } from "antd-zod";
import { LoadingOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { route, Route } from "../../../Common/Route";
import { CreateSupplierSchema } from "../../../Shared/validation";

type TSupplierFormProps = {
    isUpdate: boolean;
    data: TSupplier;
};

const FormSupplier: React.FC<TSupplierFormProps> = (props) => {
    const zodSync = createSchemaFieldRule(CreateSupplierSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditMasterSupplier, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreateMasterSupplier, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.MasterSupplier);
    };

    return (
        <RootLayout
            title={props.isUpdate ? "Edit Supplier" : "Tambah Supplier"}
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "30%", marginInline: "auto" }}>
                    <Title level={4}>
                        {props.isUpdate
                            ? "Form Edit Supplier"
                            : "Form Tambah Supplier"}
                    </Title>
                    <Form
                        form={form}
                        initialValues={{
                            ...props.data,
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ marginTop: "0.5rem" }}
                    >
                        <Form.Item rules={[zodSync]} name="name" label="Nama">
                            <Input placeholder="PT INDOMARKO" />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="contactPerson"
                            label="Contact Person"
                        >
                            <Input placeholder="Wanda Hamidah" />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="noWhatsapp"
                            label="No Whatsapp"
                        >
                            <Input placeholder="08212313233123" />
                        </Form.Item>
                        <Form.Item rules={[zodSync]} name="email" label="Email">
                            <Input
                                placeholder="faisal@aciro.id"
                                autoComplete="email"
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="alamat"
                            label="Alamat"
                        >
                            <Input placeholder="Jl. Panjang Banget. RT09, RW10" />
                        </Form.Item>
                        <Form.Item rules={[zodSync]} name="kota" label="Kota">
                            <Input placeholder="DKI Jakarta" />
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

export default FormSupplier;
