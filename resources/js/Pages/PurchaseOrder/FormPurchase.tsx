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
    notification,
    Select,
} from "antd";
import { createSchemaFieldRule } from "antd-zod";
import React, { useEffect, useState } from "react";
import { route, Route } from "../../Common/Route";
import RootLayout from "../../Layouts/RootLayout";
import Title from "antd/es/typography/Title";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import {
    CreateBarangMasukSchema,
    CreatePurchaseOrderSchema,
} from "../../Shared/validation";
import { TPurchaseOrder } from "../../Types/entities";
import { BaseOptionType } from "antd/es/select";
import dayjs from "dayjs";

type TFormPurchaseOrderProps = {
    isUpdate: boolean;
    data: TPurchaseOrder;
    optionBarang: BaseOptionType[];
    optionSupplier: BaseOptionType[];
};

const FormPurchaseOrder: React.FC<TFormPurchaseOrderProps> = (props) => {
    const zodSync = createSchemaFieldRule(CreatePurchaseOrderSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [filteredBarangOptions, setFilteredBarangOptions] = useState([]);

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditPurchaseOrder, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreatePurchaseOrder, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.PurchaseOrder);
    };

    const fetchBarangBySupplier = async (supplierId: number) => {
        if (!supplierId) {
            setFilteredBarangOptions([]);
            return;
        }
        try {
            const response = await fetch(
                `/api/barang-by-supplier?supplier_id=${supplierId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = await response.json();
            setFilteredBarangOptions(data);
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Something went wrong",
            });
            setFilteredBarangOptions([]);
        }
    };

    useEffect(() => {
        if (props?.data?.supplier_id) {
            fetchBarangBySupplier(props?.data?.supplier_id);
        }
    }, [props?.data?.supplier_id]);

    const handleChangeSupplier = (value: number) => {
        form.resetFields(["items"]);
        fetchBarangBySupplier(value);
    };

    const barangOptions =
        filteredBarangOptions.length > 0
            ? filteredBarangOptions
            : [
                  {
                      label: "Pilih Supplier terlebih dahulu",
                      value: "",
                      disabled: true,
                  },
              ];

    return (
        <RootLayout
            title={
                props.isUpdate ? "Edit Purchase Order" : "Tambah Purchase Order"
            }
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "40%", marginInline: "auto" }}>
                    <Title level={3}>
                        {props.isUpdate
                            ? "Form Edit Purchase Order"
                            : "Form Tambah Purchase Order"}
                    </Title>
                    <Title level={5}>Informasi Umum Purchase Order</Title>
                    <Form
                        form={form}
                        initialValues={{
                            nomor_referensi: props?.data?.nomor_referensi,
                            tanggal_order: props?.data?.tanggal_order
                                ? dayjs(props?.data?.tanggal_order)
                                : null,
                            supplier_id: props?.data?.supplier_id,
                            catatan: props?.data?.catatan,
                            items: props?.data?.items?.map((item) => ({
                                barang_id: item.barang_id,
                                quantity: item.quantity,
                                harge_beli: item.harga_beli,
                            })),
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
                                name="tanggal_order"
                                label="Tanggal Order"
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                rules={[zodSync]}
                                name="supplier_id"
                                label="Pilih Supplier"
                                style={{ flex: 1 }}
                            >
                                <Select
                                    options={props.optionSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </Form.Item>
                        </Flex>

                        <Form.Item label="Catatan" name="catatan">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <Divider style={{ margin: "2rem 0" }} />

                        <Title level={5}>Detail Item Purchase Order</Title>

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
                                                    options={barangOptions}
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
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Harga Beli"
                                                name={[
                                                    field.name,
                                                    "harga_beli",
                                                ]}
                                                rules={[zodSync]}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    placeholder="10"
                                                    style={{
                                                        width: "100%",
                                                    }}
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

export default FormPurchaseOrder;
