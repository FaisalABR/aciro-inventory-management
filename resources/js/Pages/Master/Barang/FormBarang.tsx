import React, { useState } from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { Button, Card, Flex, Form, Input, InputNumber, Select } from "antd";
import Title from "antd/es/typography/Title";
import { createSchemaFieldRule } from "antd-zod";
import { Route, route } from "../../../Common/Route";
import { router } from "@inertiajs/react";
import { LoadingOutlined } from "@ant-design/icons";
import { CreateBarangSchema } from "../../../Shared/validation";
import { TBarang } from "../../../Types/entities";
import { BaseOptionType } from "antd/es/select";
import { formatRupiah, parser } from "../../../Shared/utils";

type TFormBarangProps = {
    isUpdate: boolean;
    data: TBarang;
    optionSatuan: BaseOptionType[];
    optionSupplier: BaseOptionType[];
    optionKategori: BaseOptionType[];
};

const FormBarang: React.FC<TFormBarangProps> = (props) => {
    const zodSync = createSchemaFieldRule(CreateBarangSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditMasterBarang, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreateMasterBarang, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.MasterBarang);
    };

    return (
        <RootLayout
            title={props.isUpdate ? "Edit Barang" : "Tambah Barang"}
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "30%", marginInline: "auto" }}>
                    <Title level={4}>
                        {props.isUpdate
                            ? "Form Edit Barang"
                            : "Form Tambah Barang"}
                    </Title>
                    <Form
                        form={form}
                        initialValues={{
                            ...props.data,
                            name: props.data?.name,
                            satuan_id: props.data?.satuan_id,
                            kategori_id: props.data?.kategori_id,
                            supplier_id: props.data?.supplier_id,
                            hargaBeli: props.data?.hargaBeli,
                            hargaJual: props.data?.hargaJual,
                            maximal_quantity: props.data?.maximal_quantity,
                            rata_rata_permintaan_harian: Number(
                                props.data?.rata_rata_permintaan_harian,
                            ),
                            leadtime: Number(props.data?.leadtime),
                            safety_stock: Number(props.data?.safety_stock),
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        style={{ marginTop: "0.5rem" }}
                    >
                        <Form.Item rules={[zodSync]} name="name" label="Nama">
                            <Input placeholder="Indomie Goreng Jumbo" />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="supplier_id"
                            label="Supplier"
                        >
                            <Select options={props.optionSupplier} />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="satuan_id"
                            label="Satuan"
                        >
                            <Select options={props.optionSatuan} />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="kategori_id"
                            label="Kategori"
                        >
                            <Select options={props.optionKategori} />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="hargaBeli"
                            label="Harga Beli"
                        >
                            <InputNumber<number>
                                formatter={formatRupiah}
                                parser={parser}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="hargaJual"
                            label="Harga Jual"
                        >
                            <InputNumber<number>
                                formatter={formatRupiah}
                                parser={parser}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[zodSync]}
                            name="maximal_quantity"
                            label="Kuantitas Maksimal"
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
                            rules={[zodSync]}
                            name="rata_rata_permintaan_harian"
                            label="Rata-rata Permintaan Harian"
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
                            rules={[zodSync]}
                            name="leadtime"
                            label="Lead Time"
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
                            rules={[zodSync]}
                            name="safety_stock"
                            label="Safety Stock"
                        >
                            <InputNumber
                                min={1}
                                placeholder="10"
                                style={{
                                    width: "100%",
                                }}
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

export default FormBarang;
