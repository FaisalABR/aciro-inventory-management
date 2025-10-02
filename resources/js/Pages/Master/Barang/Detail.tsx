import RootLayout from "../../../Layouts/RootLayout";
import React from "react";
import { TBarang } from "../../../Types/entities";
import { Card, Descriptions, DescriptionsProps } from "antd";

type TBDetailBarangProps = {
    data: TBarang;
};

const Detail: React.FC<TBDetailBarangProps> = (props) => {
    const { data } = props;

    const descItems: DescriptionsProps["items"] = [
        {
            key: data?.uuid,
            label: "UUID",
            children: data?.uuid,
        },
        {
            key: data?.name,
            label: "Nama",
            children: data?.name,
        },
        {
            key: data?.supplier?.name,
            label: "Supplier",
            children: data?.supplier?.name,
        },
        {
            key: data?.satuan?.name,
            label: "Satuan",
            children: data?.satuan?.name,
        },
        {
            key: data?.hargaBeli || "catatan",
            label: "Harga Beli",
            children: data?.hargaBeli,
        },
        {
            key: data?.hargaJual || "catatan",
            label: "Harga Jual",
            children: data?.hargaJual,
        },
        {
            key: data?.maximal_quantity || "N/A",
            label: "Kuantitas Maksimal",
            children: data?.maximal_quantity,
        },
        {
            key: data?.rata_rata_permintaan_harian || "N/A",
            label: "Rata-rata Permintaan Harian",
            children: data?.rata_rata_permintaan_harian,
        },
        {
            key: data?.leadtime || "N/A",
            label: "Lead Time",
            children: data?.leadtime,
        },
        {
            key: data?.safety_stock || "N/A",
            label: "Safety Stock",
            children: data?.safety_stock,
        },
    ];

    return (
        <RootLayout type="main" title="Detail Barang">
            <Card style={{ marginBottom: "1rem" }}>
                <Descriptions
                    title="Barang"
                    layout="vertical"
                    bordered
                    items={descItems}
                />
            </Card>
        </RootLayout>
    );
};

export default Detail;
