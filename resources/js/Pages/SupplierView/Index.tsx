import { CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import { Head } from "@inertiajs/react";
import {
    Button,
    Card,
    Col,
    Descriptions,
    DescriptionsProps,
    Flex,
    Layout,
    Row,
    Table,
    Tag,
    Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { useModal } from "../../Shared/hooks";
import { Route, route } from "../../Common/Route";
import { router } from "@inertiajs/react";

const { Title } = Typography;

type TPOSupplierView = {
    data: any;
};

const SupplierView: React.FC<TPOSupplierView> = ({ data }) => {
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
            label: "Permintaan oleh",
            children: data?.supplier?.name,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan",
            children: data?.catatan,
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
            title: "Konfirmasi",
            content:
                data?.status === "TERKIRIM"
                    ? `Apakah anda yakin ingin konfirmasi ${data?.nomor_referensi}?`
                    : `Apakah anda yakin ingin kirim ${data?.nomor_referensi}?`,
            okText: "Yes",
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

    const handlePrint = () => {
        return;
    };
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
                            <Title level={2}>PO Supplier View</Title>
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
                                    Print PO
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    disabled={["BARANG DIKIRIM"].some(
                                        (item) => item === data?.status,
                                    )}
                                    icon={<CheckCircleOutlined />}
                                    onClick={handleKonfirmasi}
                                >
                                    {data?.status === "TERKIRIM"
                                        ? "Konfirmasi"
                                        : "Kirim Barang"}
                                </Button>
                            </Flex>
                        </Flex>
                        <Card style={{ marginBottom: "1rem" }}>
                            <Descriptions
                                title="Barang Keluar"
                                layout="vertical"
                                bordered
                                items={descItems}
                            />
                        </Card>
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
