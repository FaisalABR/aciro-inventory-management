import usePagePolling from "../../Shared/usePagePooling";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FilePdfOutlined,
    PrinterOutlined,
    TruckOutlined,
} from "@ant-design/icons";
import { Head } from "@inertiajs/react";
import {
    Button,
    Card,
    Col,
    Descriptions,
    DescriptionsProps,
    Flex,
    Image,
    Layout,
    Row,
    Table,
    Tag,
    Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useModal } from "../../Shared/hooks";
import { Route, route } from "../../Common/Route";
import { router } from "@inertiajs/react";
import { TemplatePOPDF } from "../PurchaseOrder/TemplatePOPDF";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import TextArea from "antd/es/input/TextArea";
import { formatRupiah } from "../../Shared/utils";

const { Title } = Typography;

type TPOSupplierView = {
    data: any;
};

const SupplierView: React.FC<TPOSupplierView> = ({ data }) => {
    const [qrData, setQrData] = useState<string>("");
    usePagePolling({ interval: 5000, only: ["data"] });
    const pembayaran = data?.pembayaran[0];
    const fileUrl = `/storage/${pembayaran?.bukti_pembayaran}`;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
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
            children: data?.verifikasi_kepala_toko ? (
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
            key: data?.catatan || "catatan",
            label: "Catatan",
            children: data?.catatan,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan Penolakan Supplier",
            children: data?.catatan_penolakan_supplier,
        },
    ];

    const descPembayaran: DescriptionsProps["items"] = [
        {
            key: pembayaran?.metode_pembayaran,
            label: "Metode Pembayaran",
            children: pembayaran?.metode_pembayaran,
        },
        {
            key: pembayaran?.nama_bank,
            label: "Nama Bank",
            children: pembayaran?.nama_bank,
        },
        {
            key: pembayaran?.tanggal_pembayaran,
            label: "Tanggal Pembayaran",
            children: pembayaran?.tanggal_pembayaran,
        },
        {
            key: pembayaran?.jumlah,
            label: "Jumlah",
            children: formatRupiah(pembayaran?.jumlah),
        },
        {
            key: pembayaran?.bukti_pembayaran,
            label: "Bukti Pembayaran",
            children: isImage ? (
                <Image
                    width={200}
                    src={fileUrl}
                    alt="Bukti Pembayaran"
                    style={{
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                        padding: 4,
                    }}
                />
            ) : (
                <Button
                    icon={<FilePdfOutlined />}
                    type="primary"
                    href={fileUrl}
                    target="_blank"
                >
                    Lihat File PDF
                </Button>
            ),
        },
        {
            key: pembayaran?.catatan,
            label: "Catatan",
            children: pembayaran?.catatan,
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

    const dataTable = data?.items.map((item: any) => {
        return { ...item, key: item?.barang_id, name: item?.barang.name };
    });

    const handleKonfirmasi = () => {
        return useModal({
            type: "confirm",
            content:
                data?.status === "TERKIRIM"
                    ? `Apakah anda yakin ingin konfirmasi ${data?.nomor_referensi}?`
                    : `Apakah anda yakin ingin kirim ${data?.nomor_referensi}?`,
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.KonfirmasiPOSupplier, {
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
                    route(Route.TolakPurchaseOrderSupplier, {
                        uuid: data?.uuid,
                    }),
                    { reason },
                );
            },
        });
    };

    useEffect(() => {
        const generateQR = async () => {
            const qr = await QRCode.toDataURL(data?.uuid); // bisa ganti ke poData.uuid
            setQrData(qr);
        };
        generateQR();
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

    const afterPaymentStatus = [
        "SUDAH DIBAYAR",
        "BARANG DIKIRIM",
        "BARANG SAMPAI",
    ].some((item) => item === data?.status);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title={`PO Supplier View | Aciro Inventory Management`} />
            <Layout style={{ height: "100vh", overflowY: "scroll" }}>
                <Row style={{ width: "100%" }}>
                    <Col span={24} style={{ padding: "2rem 1.5rem" }}>
                        <Flex
                            align="center"
                            justify="space-between"
                            style={{ marginBottom: "1rem" }}
                        >
                            <Title level={2}>Supplier Portal</Title>
                            <Flex
                                align="center"
                                justify="space-between"
                                gap="small"
                            >
                                <Button
                                    type="default"
                                    size="large"
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                >
                                    Print
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    disabled={["BARANG SAMPAI"].some(
                                        (item) => item === data?.status,
                                    )}
                                    icon={
                                        data?.status === "TERKIRIM" ? (
                                            <CheckCircleOutlined />
                                        ) : (
                                            <TruckOutlined />
                                        )
                                    }
                                    onClick={handleKonfirmasi}
                                >
                                    {data?.status === "TERKIRIM"
                                        ? "Konfirmasi"
                                        : "Kirim Barang"}
                                </Button>
                                <Button
                                    danger
                                    type="primary"
                                    size="large"
                                    icon={<CloseCircleOutlined />}
                                    onClick={handleReject}
                                    disabled={[
                                        "KONFIRMASI SUPPLIER",
                                        "MENUNGGU PEMBAYARAN",
                                        "BARANG DIKIRIM",
                                        "BARANG SAMPAI",
                                        "SUDAH DIBAYAR",
                                    ].some((item) => item === data?.status)}
                                >
                                    Tolak
                                </Button>
                            </Flex>
                        </Flex>
                        <Card style={{ marginBottom: "1rem" }}>
                            <Descriptions
                                title="Informasi Purchase Order"
                                layout="vertical"
                                bordered
                                items={descItems}
                            />
                        </Card>
                        {afterPaymentStatus && (
                            <Card style={{ marginBottom: "1rem" }}>
                                <Descriptions
                                    title="Informasi Pembayaran"
                                    layout="vertical"
                                    bordered
                                    items={descPembayaran}
                                />
                            </Card>
                        )}
                        <Card>
                            <Table columns={columns} dataSource={dataTable} />
                        </Card>
                    </Col>
                </Row>
            </Layout>
        </Layout>
    );
};

export default SupplierView;
