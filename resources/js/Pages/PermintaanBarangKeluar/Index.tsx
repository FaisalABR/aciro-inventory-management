import React from "react";
import RootLayout from "../../Layouts/RootLayout";
import { Link, router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { Button, Table, Tag } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { TBarangKeluar } from "../../Types/entities";
import { useModal } from "../../Shared/hooks";

type TPermintaanBarangKeluarIndexProps = {
    data: TBarangKeluar[];
};

const Index: React.FC<TPermintaanBarangKeluarIndexProps> = (props) => {
    const handleDelete = (uuid: string, reference: string) => {
        return useModal({
            type: "confirm",
            title: "Konfirmasi",
            content: `Apakah anda yakin ingin menghapus ${reference}?`,
            okText: "Yes",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
                danger: true,
            },
            onOk: () => {
                router.delete(
                    route(Route.DeletePermintaanBarangKeluar, {
                        uuid,
                    }),
                );
            },
        });
    };
    const columns: ColumnsType = [
        {
            title: "Nomor Referensi",
            dataIndex: "nomor_referensi",
            key: "nomor_referensi",
        },
        {
            title: "Tanggal Keluar",
            dataIndex: "tanggal_keluar",
            key: "tanggal_keluar",
        },
        {
            title: "Jumlah Item Unik",
            dataIndex: "total_unique_items",
            key: "total_unique_items",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                switch (record.status) {
                    case "Disetujui":
                        return <Tag color="green">{record.status}</Tag>;
                    case "Disetujui sebagian":
                        return <Tag color="lime">{record.status}</Tag>;
                    case "Menunggu Verifikasi":
                        return <Tag color="orange">{record.status}</Tag>;
                    case "Ditolak":
                        return <Tag color="red">{record.status}</Tag>;
                }
            },
        },
        {
            title: "Total Kuantitas",
            dataIndex: "total_quantity",
            key: "total_quantity",
        },
        {
            title: "Permintaan Oleh",
            dataIndex: ["user", "name"],
            key: "users",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href={route(Route.EditPermintaanBarangKeluar, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDelete(
                                    record.uuid,
                                    record.nomor_referensi,
                                )
                            }
                            type="primary"
                            danger
                        >
                            <DeleteOutlined />
                        </Button>
                        <Link
                            href={route(Route.PermintaanBarangKeluarDetail, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EyeOutlined />
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <RootLayout
            type="main"
            title="Permintaan Barang Keluar"
            actions={[
                <Link href={Route.CreatePermintaanBarangKeluar}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Permintaan Barang Keluar
                    </Button>
                </Link>,
            ]}
        >
            <Table dataSource={props.data} columns={columns} />;
        </RootLayout>
    );
};

export default Index;
