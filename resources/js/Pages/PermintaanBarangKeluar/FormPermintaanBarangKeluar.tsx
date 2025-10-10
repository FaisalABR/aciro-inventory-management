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
    Modal,
    notification,
    Select,
    Table,
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

const columns = [
    { title: "Nama Barang", dataIndex: "nama", key: "nama" },
    { title: "ROP", dataIndex: "rop", key: "rop" },
    { title: "Stok", dataIndex: "stock", key: "stock" },
    {
        title: "Kuantitas Keluar",
        dataIndex: "quantity_keluar",
        key: "quantity_keluar",
    },
    {
        title: "Setelah Eksekusi",
        dataIndex: "setelah_eksekusi",
        key: "setelah_eksekusi",
    },
];

const FormPermintaanBarangKeluar: React.FC<TFormPermintaanBarangKeluarProps> = (
    props,
) => {
    const zodSync = createSchemaFieldRule(CreateBarangKeluarSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            const response = await fetch("/api/check-rop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values.items),
            });

            const { errors, ropWarnings } = await response.json();

            if (errors.length > 0) {
                notification.error({
                    message: "Stok Tidak Cukup",
                    description: errors
                        .map(
                            (e: any) =>
                                `${e.nama}: Stok ${e.stock}, diminta ${e.request}`,
                        )
                        .join(", "),
                });
                return; // stop di sini
            }

            if (ropWarnings.length > 0) {
                Modal.confirm({
                    title: "ROP Warning",
                    width: 800,
                    okText: "Yakin",
                    cancelText: "Batal",
                    content: (
                        <Table
                            dataSource={ropWarnings}
                            columns={columns}
                            pagination={false}
                            rowKey="barang_id"
                            size="small"
                        />
                    ),
                    onOk: () => {
                        props.isUpdate
                            ? router.put(
                                  route(Route.EditPermintaanBarangKeluar, {
                                      uuid: props?.data?.uuid,
                                  }),
                                  values,
                              )
                            : router.post(
                                  Route.CreatePermintaanBarangKeluar,
                                  values,
                              );
                    },
                });
            } else {
                props.isUpdate
                    ? router.put(
                          route(Route.EditPermintaanBarangKeluar, {
                              uuid: props?.data?.uuid,
                          }),
                          values,
                      )
                    : router.post(Route.CreatePermintaanBarangKeluar, values);
            }
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
                    <Title level={5}>
                        Informasi Umum Permintaan Barang Keluar
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
                        <Form.Item
                            rules={[zodSync]}
                            name="nomor_referensi"
                            label="Nomor Referensi (Auto Generated)"
                        >
                            <Input placeholder="BM-06072025-001" disabled />
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
