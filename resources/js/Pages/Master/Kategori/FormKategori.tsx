import React, { useState } from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { TKategori } from "../../../Types/entities";
import { Button, Card, Flex, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import { createSchemaFieldRule } from "antd-zod";
import { LoadingOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { route, Route } from "../../../Common/Route";
import { CreateKategoriSchema } from "../../../Shared/validation";

type TKategoriFormProps = {
    isUpdate: boolean;
    data: TKategori;
};

const FormKategori: React.FC<TKategoriFormProps> = (props) => {
    const zodSync = createSchemaFieldRule(CreateKategoriSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditMasterKategori, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreateMasterKategori, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.MasterKategori);
    };

    return (
        <RootLayout
            title={props.isUpdate ? "Edit Kategori" : "Tambah Kategori"}
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "30%", marginInline: "auto" }}>
                    <Title level={4}>
                        {props.isUpdate
                            ? "Form Update Kategori"
                            : "Form Tambah Kategori"}
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
                            <Input placeholder="karton" />
                        </Form.Item>
                        <Form.Item rules={[zodSync]} name="code" label="Kode">
                            <Input placeholder="CRTN" />
                        </Form.Item>

                        <Form.Item
                            rules={[zodSync]}
                            name="description"
                            label="Deskripsi"
                        >
                            <Input placeholder="Karton adalah untuk menggunakan kardus" />
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

export default FormKategori;
