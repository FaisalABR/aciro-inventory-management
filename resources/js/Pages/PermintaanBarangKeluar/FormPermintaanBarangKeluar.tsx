import { router } from "@inertiajs/react";
import {
    Button,
    Card,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Select,
} from "antd";
import { createSchemaFieldRule } from "antd-zod";
import React, { useState } from "react";
import { route, Route } from "../../Common/Route";
import RootLayout from "../../Layouts/RootLayout";
import Title from "antd/es/typography/Title";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { CreateBarangKeluarSchema } from "../../Shared/validation";
import { TBarang } from "../../Types/entities";
import { BaseOptionType } from "antd/es/select";

type TFormPermintaanBarangKeluarProps = {
    isUpdate: boolean;
    data: TBarang;
    optionBarang: BaseOptionType[];
    optionSupplier: BaseOptionType[];
};

const FormPermintaanBarangKeluar: React.FC<TFormPermintaanBarangKeluarProps> = (
    props,
) => {
    const zodSync = createSchemaFieldRule(CreateBarangKeluarSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditPermintaanBarangKeluar, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreatePermintaanBarangKeluar, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.PermintaanBarangKeluar);
    };

    return (
        <RootLayout
            title={
                props.isUpdate
                    ? "Edit Permintaan Barang Keluar"
                    : "Tambah Permintaan Barang Keluar"
            }
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "40%", marginInline: "auto" }}>
                    <Title level={3}>
                        {props.isUpdate
                            ? "Form Edit Permintaan Barang Keluar"
                            : "Form Tambah Permintaan Barang Keluar"}
                    </Title>
                    <Title level={5}>Informasi Umum Permintaan</Title>
                    <Form
                        form={form}
                        initialValues={{
                            ...props.data,
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ marginTop: "0.5rem" }}
                    >
                        <Form.Item
                            rules={[zodSync]}
                            name="nomor_referensi"
                            label="Nomor Referensi"
                        >
                            <Input placeholder="BM-06072025-001" />
                        </Form.Item>
                        <Flex gap="small">
                            <Form.Item
                                rules={[zodSync]}
                                name="tanggal_keluar"
                                label="Tanggal Keluar"
                            >
                                <DatePicker />
                            </Form.Item>
                        </Flex>

                        <Form.Item label="Catatan" name="catatan">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <Divider style={{ margin: "2rem 0" }} />

                        <Title level={5}>
                            Detail Item Permintaan Barang Keluar
                        </Title>
                        <Form.List name="items">
                            {(fields, { add, remove }, { errors }) => (
                                <div
                                    style={{
                                        display: "flex",
                                        rowGap: 16,
                                        flexDirection: "column",
                                    }}
                                >
                                    {fields.map((field) => (
                                        <Card
                                            size="small"
                                            title={`Item ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <CloseOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            }
                                        >
                                            <Form.Item
                                                label="Barang"
                                                name={[field.name, "barang_id"]}
                                                rules={[zodSync]}
                                            >
                                                <Select
                                                    options={props.optionBarang}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Kuantitas"
                                                name={[field.name, "quantity"]}
                                                rules={[zodSync]}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    placeholder="10"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Card>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                        >
                                            + Add Item
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>

                        <Flex gap="small" style={{ marginTop: "2rem" }}>
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

export default FormPermintaanBarangKeluar;
