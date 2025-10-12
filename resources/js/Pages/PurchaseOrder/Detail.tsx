import RootLayout from "../../Layouts/RootLayout";
import React, { useEffect, useState } from "react";
import { TPurchaseOrder } from "../../Types/entities";
import {
    Alert,
    Button,
    Card,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    QRCode as QRCodeAntd,
    Select,
    Table,
    Tag,
    Upload,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    PrinterFilled,
    ProductOutlined,
} from "@ant-design/icons";
import { useModal } from "../../Shared/hooks";
import { router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";
import QRCode from "qrcode";
import { TemplatePOPDF } from "./TemplatePOPDF";
import { pdf } from "@react-pdf/renderer";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { createSchemaFieldRule } from "antd-zod";
import { CreatePembayaranPOSchema } from "../../Shared/validation";
import dayjs from "dayjs";
import usePagePolling from "../../Shared/usePagePooling";

type TDetailPurchaseOrderProps = {
    data: TPurchaseOrder;
    auth: any;
};

const Detail: React.FC<TDetailPurchaseOrderProps> = (props) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const { data } = props;
    const [qrData, setQrData] = useState<string>("");
    const [fileList, setFileList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const zodSync = createSchemaFieldRule(CreatePembayaranPOSchema);
    const [form] = Form.useForm();
    const pembayaran = props?.data?.pembayaran[0];

    const handleVerification = () => {
        // hitung total verifikator
        const verifikator = [
            data?.verifikasi_kepala_toko,
            data?.verifikasi_kepala_gudang,
            data?.verifikasi_kepala_pengadaan,
            data?.verifikasi_kepala_accounting,
        ];

        const sudahVerifikasi = verifikator.filter(Boolean).length;
        const totalVerifikator = verifikator.length;

        const isLastVerifier = sudahVerifikasi === totalVerifikator - 1;
        return useModal({
            type: "confirm",
            content: isLastVerifier
                ? `Anda adalah orang terakhir yang melakukan verifikasi. Apakah anda yakin ingin verifikasi ${data?.nomor_referensi}? Karena akan auto dikirim ke supplier.`
                : `Apakah anda yakin ingin verifikasi ${data?.nomor_referensi}?`,
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.VerifikasiPurchaseOrder, {
                        uuid: data?.uuid,
                    }),
                );
            },
        });
    };

    const handleArrived = () => {
        return useModal({
            type: "confirm",
            content: `Apakah yakin untuk konfirmasi ${data?.nomor_referensi} sudah sampai?`,
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.SampaiPurchaseOrder, {
                        uuid: data?.uuid,
                    }),
                );
            },
        });
    };

    const handleReject = () => {
        let reason = "";
        return useModal({
            type: "confirm",
            content: (
                <div>
                    <p>Apakah anda yakin menolak {data?.nomor_referensi}?</p>
                    <TextArea
                        rows={3}
                        style={{ marginTop: "1rem" }}
                        placeholder="Masukkan alasan penolakan"
                        onChange={(e) => (reason = e.target.value)} // simpan ke variabel
                    />
                </div>
            ),
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.TolakPurchaseOrder, {
                        uuid: data?.uuid,
                    }),
                    { reason },
                );
            },
        });
    };

    const descItems: DescriptionsProps["items"] = [
        {
            key: data?.uuid,
            label: "UUID",
            children: data?.uuid,
        },
        {
            key: data?.nomor_referensi,
            label: "Nomor Referensi",
            children: data?.nomor_referensi,
        },
        {
            key: data?.tanggal_order,
            label: "Tanggal Order",
            children: data?.tanggal_order,
        },
        {
            key: data?.status,
            label: "Status",
            children: data?.status,
        },
        {
            key: "verifikasi kepala toko" + data?.uuid,
            label: "Verifikasi Kepala Toko",
            children: data?.kepala_toko_menolak ? (
                <Tag color="red">Ditolak</Tag>
            ) : data?.verifikasi_kepala_toko ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: "verifikasi kepala gudang" + data?.uuid,
            label: "Verifikasi Kepala Gudang",
            children: data?.verifikasi_kepala_gudang ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: "verifikasi kepala pengadaan" + data?.uuid,
            label: "Verifikasi Kepala Pengadaan",
            children: data?.verifikasi_kepala_pengadaan ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: "verifikasi kepala accounting" + data?.uuid,
            label: "Verifikasi Kepala Accounting",
            children: data?.verifikasi_kepala_accounting ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: data?.supplier_id,
            label: "Supplier",
            children: data?.supplier?.name,
        },
        {
            key: data?.tanggal_sampai,
            label: "Tanggal Sampai",
            children: data?.tanggal_sampai,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan",
            children: data?.catatan,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan Penolakan Internal",
            children: data?.catatan_penolakan,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan Penolakan Supplier",
            children: data?.catatan_penolakan_supplier,
        },
        {
            label: "QR Code",
            children: <QRCodeAntd value={data?.uuid} />,
        },
    ];

    const columns: ColumnsType = [
        {
            title: "Nama Barang",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Kuantitas",
            dataIndex: "quantity",
            key: "quantity",
        },
    ];

    const dataTable = data?.items.map((item) => {
        return { ...item, key: item?.barang_id, name: item?.barang.name };
    });

    useEffect(() => {
        const generateQR = async () => {
            const qr = await QRCode.toDataURL(data?.uuid); // bisa ganti ke poData.uuid
            setQrData(qr);
        };
        generateQR();
    }, []);

    useEffect(() => {
        let interval: any;

        const startPolling = () => {
            console.log("Jalan");
            interval = setInterval(() => {
                router.reload({ only: ["data"] });
            }, 5000);
        };

        const stopPolling = () => {
            clearInterval(interval);
        };

        window.addEventListener("focus", startPolling);
        window.addEventListener("blur", stopPolling);

        startPolling();

        return () => {
            stopPolling();
            window.removeEventListener("focus", startPolling);
            window.removeEventListener("blur", stopPolling);
        };
    }, []);

    const handlePrint = async () => {
        try {
            const blob = await pdf(
                <TemplatePOPDF po={data} qrData={qrData} />,
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = url;

            // Add load event listener before appending iframe
            iframe.onload = () => {
                try {
                    // Wait for iframe to be ready
                    setTimeout(() => {
                        if (iframe.contentWindow) {
                            iframe.contentWindow.print();
                        }
                    }, 1000);

                    // Remove iframe after printing is done or cancelled
                    window.addEventListener(
                        "afterprint",
                        () => {
                            document.body.removeChild(iframe);
                            URL.revokeObjectURL(url);
                        },
                        { once: true },
                    );
                } catch (error) {
                    console.error("Print window error:", error);
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                }
            };

            document.body.appendChild(iframe);
        } catch (error) {
            console.error("Error generating PDF for print:", error);
        }
    };

    const userRole = props?.auth?.user?.roles?.[0];
    const disabledByRole =
        (userRole === "kepala_toko" && data?.verifikasi_kepala_toko) ||
        (userRole === "kepala_gudang" && data?.verifikasi_kepala_gudang) ||
        (userRole === "kepala_accounting" &&
            data?.verifikasi_kepala_accounting) ||
        (userRole === "kepala_pengadaan" && data?.verifikasi_kepala_pengadaan);

    const isDisabled = [
        "TOLAK",
        "TOLAK SUPPLIER",
        "KONFIRMASI SUPPLIER",
        "BARANG DIKIRIM",
        "MENUNGGU PEMBAYARAN",
    ].includes(data?.status);

    const onFinish = async () => {
        const values = form.getFieldsValue();

        Modal.confirm({
            content:
                "Apakah Anda yakin ingin mengirim melakukan pembayaran, data yang sudah di submit tidak bisa diubah?",
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: { type: "primary", danger: true },
            centered: true,
            onOk: async () => {
                setIsLoading(true);

                try {
                    const formData = new FormData();
                    Object.keys(values).forEach((key) => {
                        const value = values[key];
                        if (value?.format) {
                            // format date
                            formData.append(key, value.format("YYYY-MM-DD"));
                        } else {
                            formData.append(key, value);
                        }
                    });

                    if (fileList.length > 0) {
                        formData.append(
                            "bukti_pembayaran",
                            fileList[0].originFileObj,
                        );
                    }

                    router.post(
                        route(Route.PembayaranPurchaseOrder, { id: data.id }),
                        formData,
                        {
                            forceFormData: true,
                            onFinish: () => setIsLoading(false),
                        },
                    );
                } catch (error) {
                    console.error(error);
                    setIsLoading(false);
                }
            },
        });
    };

    const afterPaymentStatus = [
        "SUDAH DIBAYAR",
        "BARANG DIKIRIM",
        "BARANG SAMPAI",
    ].some((item) => item === data?.status);

    const showActions = [
        "kepala_toko",
        "kepala_pengadaan",
        "kepala_gudang",
        "kepala_accounting",
    ].some((item) => item === userRole)
        ? [
              <Button
                  type="default"
                  size="large"
                  icon={<PrinterFilled />}
                  onClick={handlePrint}
              >
                  Print
              </Button>,
              <Button
                  type="primary"
                  size="large"
                  disabled={
                      [
                          "DRAFT",
                          "VERIFIKASI",
                          "TERKIRIM",
                          "KONFIRMASI SUPPLIER",
                          "BARANG DIKIRIM",
                          "TOLAK",
                          "TOLAK SUPPLIER",
                          "MENUNGGU PEMBAYARAN",
                      ].some((item) => item === data?.status) || disabledByRole
                  }
                  icon={<CheckCircleOutlined />}
                  onClick={handleVerification}
              >
                  Verifikasi
              </Button>,
              <Button
                  key="reject"
                  danger
                  type="primary"
                  size="large"
                  icon={<CloseCircleOutlined />}
                  onClick={handleReject}
                  disabled={isDisabled || disabledByRole}
              >
                  Tolak
              </Button>,
          ]
        : [
              <Button
                  type="default"
                  size="large"
                  icon={<PrinterFilled />}
                  onClick={handlePrint}
              >
                  Print
              </Button>,
              data?.status === "BARANG DIKIRIM" && (
                  <Button
                      type="primary"
                      size="large"
                      icon={<ProductOutlined />}
                      onClick={handleArrived}
                      disabled={["BARANG SAMPAI"].some(
                          (item) => item === data?.status,
                      )}
                  >
                      Barang Sampai
                  </Button>
              ),
          ];
    return (
        <RootLayout
            type="main"
            title="Detail Purchase Order"
            actions={showActions}
        >
            <Card style={{ marginBottom: "1rem" }}>
                <Descriptions
                    title="Informasi Purchase Order"
                    layout="vertical"
                    bordered
                    items={descItems}
                />
            </Card>
            {userRole === "kepala_accounting" &&
                [
                    "MENUNGGU PEMBAYARAN",
                    "BARANG DIKIRIM",
                    "BARANG SAMPAI",
                    "SUDAH DIBAYAR",
                ].some((item) => item === data?.status) && (
                    <Card style={{ marginBottom: "1rem" }}>
                        <Flex vertical style={{ width: "50%" }}>
                            {afterPaymentStatus && (
                                <Alert
                                    message="Informational Notes"
                                    description="Anda sudah melakukan pembayaran dan tidak bisa mengubahnya."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: "1rem" }}
                                />
                            )}
                            <Title level={4}>Formulir Pembayaran</Title>
                            <Form
                                form={form}
                                initialValues={{
                                    ...pembayaran,
                                    tanggal_pembayaran:
                                        pembayaran?.tanggal_pembayaran
                                            ? dayjs(
                                                  pembayaran?.tanggal_pembayaran,
                                              )
                                            : null,
                                }}
                                layout="vertical"
                                onFinish={onFinish}
                                style={{ marginTop: "0.5rem" }}
                            >
                                <Form.Item
                                    label="Metode Pembayaran"
                                    name="metode_pembayaran"
                                    rules={[zodSync]}
                                >
                                    <Select
                                        disabled={afterPaymentStatus}
                                        options={[
                                            {
                                                value: "Transfer",
                                                label: "Transfer Bank",
                                            },
                                            { value: "Tunai", label: "Tunai" },
                                            { value: "Giro", label: "Giro" },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nama Bank"
                                    name="nama_bank"
                                    rules={[zodSync]}
                                >
                                    <Input disabled={afterPaymentStatus} />
                                </Form.Item>
                                <Form.Item
                                    label="Nomor Rekening"
                                    name="nomor_rekening"
                                    rules={[zodSync]}
                                >
                                    <Input disabled={afterPaymentStatus} />
                                </Form.Item>
                                <Form.Item
                                    label="Jumlah"
                                    name="jumlah"
                                    rules={[zodSync]}
                                >
                                    <InputNumber
                                        disabled={afterPaymentStatus}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Tanggal Pembayaran"
                                    name="tanggal_pembayaran"
                                    rules={[zodSync]}
                                >
                                    <DatePicker disabled={afterPaymentStatus} />
                                </Form.Item>
                                <Form.Item
                                    label="Bukti Pembayaran"
                                    name="bukti_pembayaran"
                                    rules={[zodSync]}
                                >
                                    <Upload
                                        beforeUpload={() => false} // cegah upload otomatis
                                        fileList={fileList}
                                        onChange={({ fileList }) =>
                                            setFileList(fileList)
                                        }
                                        accept=".jpg,.png,.pdf"
                                    >
                                        <Button disabled={afterPaymentStatus}>
                                            Upload Bukti
                                        </Button>
                                    </Upload>
                                </Form.Item>
                                <Form.Item
                                    label="Catatan"
                                    name="catatan"
                                    rules={[zodSync]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        disabled={afterPaymentStatus}
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    disabled={afterPaymentStatus}
                                >
                                    Kirim Pembayaran
                                </Button>
                            </Form>
                        </Flex>
                    </Card>
                )}
            <Card>
                <Table columns={columns} dataSource={dataTable} />
            </Card>
        </RootLayout>
    );
};

export default Detail;
