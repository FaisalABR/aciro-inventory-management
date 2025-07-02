import React from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { route, Route } from "../../../Common/Route";
import { Link, router } from "@inertiajs/react";
import { Button, Input, Table } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { TBarang } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";
import { formatRupiah } from "../../../Shared/utils";

type TBarangIndexProps = {
    data: TBarang[];
};

const Barang: React.FC<TBarangIndexProps> = (props) => {
    const handleDeleteBarang = (uuid: string, name: string) => {
        return useModal({
            type: "confirm",
            title: "Konfirmasi",
            content: (
                <p>
                    Apakah anda yakin ingin menghapus <b>{name}</b>?
                </p>
            ),
            okText: "Yes",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
                danger: true,
            },
            onOk: () => {
                router.delete(
                    route(Route.DeleteMasterBarang, {
                        uuid,
                    }),
                );
            },
        });
    };

    const columns: ColumnsType = [
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Supplier",
            dataIndex: "supplier",
            key: "supplier",
            render: (_, record) => {
                return <span>{record.supplier.name}</span>;
            },
        },
        {
            title: "Satuan",
            dataIndex: "satuan",
            key: "satuan",
            render: (_, record) => {
                return <span>{record.satuan.name}</span>;
            },
        },
        {
            title: "Harga Jual",
            dataIndex: "hargaJual",
            key: "hargaJual",
            render: (_, record) => {
                return formatRupiah(record.hargaJual);
            },
        },
        {
            title: "Harga Beli",
            dataIndex: "hargaBeli",
            key: "hargaBeli",
            render: (_, record) => {
                return formatRupiah(record.hargaBeli);
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href={route(Route.EditMasterBarang, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDeleteBarang(record.uuid, record.name)
                            }
                            type="primary"
                            danger
                        >
                            <DeleteOutlined />
                        </Button>
                        <EyeOutlined />
                    </div>
                );
            },
        },
    ];

    const barangData = props.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    const dummySatuan = [
        {
            uuid: "a2b3c4d5-e6f7-8901-2345-67890abcdef0",
            name: "PCS",
            code: "PCS",
            description: "Satuan per buah atau unit.",
        },
    ];

    const dummySupplier = [
        {
            uuid: "s1u2p3l4-i5e6-r789-0123-4567890abcdef",
            name: "PT. Global Retail Supply",
            contactPerson: "Andi Wijaya",
            noWhatsapp: "+6281122334455",
            email: "contact@globalretail.com",
            alamat: "Jl. Industri No. 10",
            kota: "Jakarta",
        },
    ];
    const data = [
        {
            uuid: "prod-001-abc-123",
            name: "Indomie Goreng Jumbo",
            supplier: dummySupplier[0], // Menggunakan supplier pertama
            satuan: dummySatuan[0], // Menggunakan satuan 'Pak'
            hargaJual: 3500,
            hargaBeli: 2800,
        },
    ];

    return (
        <RootLayout
            type="main"
            title="Master Barang"
            actions={[
                <Link href={Route.CreateMasterBarang}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Barang
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari Barang berdasarkan nama"
                style={{ marginBottom: "1rem" }}
            />
            <Table
                dataSource={barangData ? barangData : data}
                columns={columns}
            />
        </RootLayout>
    );
};

export default Barang;
