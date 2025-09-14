import RootLayout from "../../Layouts/RootLayout";
import React from "react";
import { TBarangKeluar } from "../../Types/entities";
import { Button, Card, Descriptions, DescriptionsProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useModal } from "../../Shared/hooks";
import { router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";

type TDetailPermintaanBarangKeluarProps = {
    data: TBarangKeluar;
};

const Detail: React.FC<TDetailPermintaanBarangKeluarProps> = (props) => {
    const { data } = props;
    const handleVerification = () => {
        return useModal({
            type: "confirm",
            title: "Konfirmasi",
            content: `Apakah anda yakin ingin verifikasi ${data?.nomor_referensi}?`,
            okText: "Yes",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.delete(
                    route(Route.VerifikasiPermintaanKeluar, {
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
            key: data?.tanggal_keluar,
            label: "Tanggal Keluar",
            children: data?.tanggal_keluar,
        },
        {
            key: data?.status,
            label: "Status",
            children: data?.status,
        },
        {
            key: "verifikasi kepala toko" + data?.uuid,
            label: "Verifikasi Kepala Toko",
            children: data?.verifikasi_kepala_toko,
        },
        {
            key: "verifikasi kepala gudang" + data?.uuid,
            label: "Verifikasi Kepala Gudang",
            children: data?.verifikasi_kepala_gudang,
        },
        {
            key: data?.user?.name,
            label: "Permintaan oleh",
            children: data?.user?.name,
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
        return { ...item, key: item?.barang_id, name: item?.barangs.name };
    });

    return (
        <RootLayout
            type="main"
            title="Detail Permintaan Barang Keluar"
            actions={[
                <Button
                    type="primary"
                    size="large"
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
