import RootLayout from "../../Layouts/RootLayout";
import React from "react";
import { TPurchaseOrder } from "../../Types/entities";
import {
    Button,
    Card,
    Descriptions,
    DescriptionsProps,
    Table,
    Tag,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useModal } from "../../Shared/hooks";
import { router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";

type TDetailPurchaseOrderProps = {
    data: TPurchaseOrder;
};

const Detail: React.FC<TDetailPurchaseOrderProps> = (props) => {
    const { data } = props;
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
            title: "Konfirmasi",
            content: isLastVerifier
                ? `Anda adalah orang terakhir yang melakukan verifikasi. Apakah anda yakin ingin verifikasi ${data?.nomor_referensi}? Karena akan auto dikirim ke supplier.`
                : `Apakah anda yakin ingin verifikasi ${data?.nomor_referensi}?`,
            okText: "Yes",
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

    const dataTable = data?.items.map((item) => {
        return { ...item, key: item?.barang_id, name: item?.barang.name };
    });

    return (
        <RootLayout
            type="main"
            title="Detail Permintaan Barang Keluar"
            actions={[
                <Button
                    type="primary"
                    size="large"
                    disabled={[
                        "DRAFT",
                        "VERIFIKASI",
                        "TERKIRIM",
                        "KONFIRMASI SUPPLIER",
                        "BARANG DIKIRIM",
                    ].some((item) => item === data?.status)}
                    icon={<CheckCircleOutlined />}
                    onClick={handleVerification}
                >
                    Verifikasi
                </Button>,
            ]}
        >
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
        </RootLayout>
    );
};

export default Detail;
