import RootLayout from "../../Layouts/RootLayout";
import usePagePolling from "../../Shared/usePagePooling";
import React from "react";
import { TBarangMasuk } from "../../Types/entities";
import { Card, Descriptions, DescriptionsProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { formatRupiah } from "../../Shared/utils";

type TDetailBarangMasukProps = {
    data: TBarangMasuk;
};

const Detail: React.FC<TDetailBarangMasukProps> = (props) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const { data } = props;

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

    return (
        <RootLayout type="main" title="Detail Barang Masuk">
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
