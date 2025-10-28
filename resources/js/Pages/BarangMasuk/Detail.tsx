import RootLayout from "../../Layouts/RootLayout";
import usePagePolling from "../../Shared/usePagePooling";
import React from "react";
import { TBarangMasuk } from "../../Types/entities";
import {
    Button,
    Card,
    Descriptions,
    DescriptionsProps,
    Table,
    Tag,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { formatRupiah } from "../../Shared/utils";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useModal } from "../../Shared/hooks";
import { router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";

type TDetailBarangMasukProps = {
    data: TBarangMasuk;
    auth: any;
};

const Detail: React.FC<TDetailBarangMasukProps> = (props) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const { data, auth } = props;
    const userRole = auth?.user?.roles?.[0];

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
            key: data?.supplier,
            label: "Supplier",
            children: data?.supplier,
        },
        {
            key: data?.tanggal_masuk,
            label: "Tanggal Masuk",
            children: data?.tanggal_masuk,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan",
            children: data?.catatan,
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
        {
            title: "Harga Beli",
            dataIndex: "harga_beli",
            key: "harga_beli",
            render: (_, record) => {
                return formatRupiah(record.harga_beli);
            },
        },
    ];

    const dataTable = data.items.map((item) => {
        return { ...item, key: item?.barang_id, name: item?.barangs.name };
    });

    const handleVerification = () => {
        return useModal({
            type: "confirm",
            content: `Apakah anda yakin verifikasi ${data?.nomor_referensi}?`,
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.VerifikasiBarangMasuk, {
                        uuid: data?.uuid,
                    }),
                );
            },
        });
    };

    const disabledByRole =
        (userRole === "kepala_toko" && data?.verifikasi_kepala_toko) ||
        (userRole === "kepala_gudang" && data?.verifikasi_kepala_gudang);

    return (
        <RootLayout
            type="main"
            title="Detail Barang Masuk"
            actions={[
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
                        ].some((item) => item === data?.status) ||
                        disabledByRole
                    }
                    icon={<CheckCircleOutlined />}
                    onClick={handleVerification}
                >
                    Verifikasi
                </Button>,
            ]}
        >
            <Card style={{ marginBottom: "1rem" }}>
                <Descriptions
                    title="Informasi Barang Masuk"
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
