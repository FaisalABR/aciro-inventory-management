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
} from "antd";
import { createSchemaFieldRule } from "antd-zod";
import React, { useRef, useState } from "react";
import { route, Route } from "../../Common/Route";
import RootLayout from "../../Layouts/RootLayout";
import Title from "antd/es/typography/Title";
import {
    CloseOutlined,
    LoadingOutlined,
    QrcodeOutlined,
} from "@ant-design/icons";
import { CreateBarangMasukSchema } from "../../Shared/validation";
import { TBarang } from "../../Types/entities";
import { BaseOptionType } from "antd/es/select";
import QrReader from "react-qr-reader-es6";

type TFormBarangMasukProps = {
    isUpdate: boolean;
    data: TBarang;
    optionBarang: BaseOptionType[];
    optionSupplier: BaseOptionType[];
};

const FormBarangMasuk: React.FC<TFormBarangMasukProps> = (props) => {
    const zodSync = createSchemaFieldRule(CreateBarangMasukSchema);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [filteredBarangOptions, setFilteredBarangOptions] = useState([]);
    const [isOpenQR, setIsOpenQR] = useState(false);
    const [scannedUuid, setScannedUuid] = useState(null);
    const items = Form.useWatch("items", form);

    const onFinish = async () => {
        const values = form.getFieldsValue();
        try {
            props.isUpdate
                ? router.put(
                      route(Route.EditBarangMasuk, {
                          uuid: props?.data?.uuid,
                      }),
                      values,
                  )
                : router.post(Route.CreateBarangMasuk, values);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        router.get(Route.BarangMasuk);
    };

    const fetchBarangBySupplier = async (supplierId: number) => {
        if (!supplierId) {
            setFilteredBarangOptions([]);
            return;
        }
        try {
            const response = await fetch(
                `/api/barang-by-supplier?supplier_id=${supplierId}`,
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

    const handleError = () => {
        return;
    };

    const stopAllCameraTracks = () => {
        // Meminta semua MediaStream yang mungkin sedang berjalan
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    // Mencoba mendapatkan stream dari perangkat (ini mungkin memerlukan izin ulang,
                    // tapi seringkali cukup untuk menghentikan track yang sudah aktif)
                    navigator.mediaDevices
                        .getUserMedia({ video: true })
                        .then((stream) => {
                            stream.getTracks().forEach((track) => {
                                console.log(`Stopping track: ${track.label}`);
                                track.stop(); // Hentikan track
                            });
                        })
                        .catch((err) => {
                            // console.warn("Tidak dapat mendapatkan stream untuk pembersihan:", err);
                        });
                }
            });
        });

        // Pertahankan juga logika stopCamera Anda untuk membersihkan elemen DOM yang ada
        const videoEl = document.querySelector("video");
        if (videoEl && videoEl.srcObject) {
            (videoEl.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop());
            videoEl.srcObject = null;
        }

        console.log("Semua kamera telah dipaksa berhenti.");
    };

    const handleScan = async (result: any) => {
        console.log("result", result);
        if (result) {
            // --- LANGKAH 1: Segera Hentikan Kamera & Mulai Proses Unmount ---
            // Panggil pembersihan sebelum state apapun diubah
            stopAllCameraTracks();

            // Segera tutup modal. Unmount QrReader harus mematikan kamera.
            // Kita tidak lagi butuh setTimeout di sini karena kamera sudah kita hentikan duluan
            setIsOpenQR(false);

            // --- LANGKAH 2: Proses Data Setelah Kamera Mati ---
            setScannedUuid(result); // Set state yang memicu UI, dilakukan setelah kamera dimatikan
            try {
                const response = await fetch(`/api/po-scan/${result}`);
                const data = await response.json();

                // Lanjutkan pembaruan state/form
                form.setFieldValue("supplier_id", data?.supplier?.id);
                const barangPO = data?.items?.map((item: any) => ({
                    barang_id: item.barang_id,
                    quantity: item.quantity,
                    harga_beli: Number(item.harga_beli),
                }));
                fetchBarangBySupplier(data?.supplier?.id);
                form.setFieldValue("items", barangPO);

                notification.success({
                    message: "Success",
                    description: "Berhasil Scan PO",
                });
            } catch (error) {
                console.log("error", error);
                notification.error({
                    message: "Error",
                    description: "Something went wrong",
                });

                // Catatan: Karena kita sudah memanggil setIsOpenQR(false) di awal,
                // modal sudah tertutup meskipun terjadi error di API.
            }
        }
    };

    return (
        <RootLayout
            title={props.isUpdate ? "Edit Barang Masuk" : "Tambah Barang Masuk"}
            type="main"
        >
            <Card>
                <Flex vertical style={{ width: "40%", marginInline: "auto" }}>
                    <Title level={3}>
                        {props.isUpdate
                            ? "Form Edit Barang Masuk"
                            : "Form Tambah Barang Masuk"}
                    </Title>
                    <Title level={5}>Informasi Umum Barang Masuk</Title>
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
                                name="tanggal_masuk"
                                label="Tanggal Masuk"
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
                        <Button
                            type="primary"
                            size="large"
                            style={{ width: "100%" }}
                            icon={<QrcodeOutlined />}
                            onClick={() => setIsOpenQR(true)}
                        >
                            Scan QR
                        </Button>

                        <Divider style={{ margin: "2rem 0" }} />

                        <Title level={5}>Detail Item Barang Masuk</Title>

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
                                            <Form.Item
                                                label="Nomor Batch"
                                                name={[
                                                    field.name,
                                                    "nomor_batch",
                                                ]}
                                                rules={[zodSync]}
                                            >
                                                <Input placeholder="AX21321" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Tanggal Expired"
                                                name={[
                                                    field.name,
                                                    "tanggal_expired",
                                                ]}
                                                rules={[zodSync]}
                                            >
                                                <DatePicker />
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
                                disabled={isLoading || !items}
                                style={{ fontWeight: "medium" }}
                            >
                                {isLoading ? <LoadingOutlined /> : "Submit"}
                            </Button>
                            <Button onClick={onReset}>Batal</Button>
                        </Flex>
                    </Form>
                </Flex>
                <Modal
                    title="Tambah Data"
                    open={isOpenQR}
                    onCancel={() => {
                        stopAllCameraTracks();
                        setTimeout(() => {
                            setIsOpenQR(false);
                        }, 100);
                    }}
                    cancelText="Batal"
                >
                    {isOpenQR && (
                        <QrReader
                            key={Date.now()}
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: "100%" }}
                        />
                    )}
                </Modal>
            </Card>
        </RootLayout>
    );
};

export default FormBarangMasuk;
