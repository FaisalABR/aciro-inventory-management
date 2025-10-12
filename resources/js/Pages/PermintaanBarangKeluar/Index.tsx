import React from "react";
import RootLayout from "../../Layouts/RootLayout";
import { Link, router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { Button, Table, Tag } from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { TBarangKeluar } from "../../Types/entities";
import { useModal } from "../../Shared/hooks";
import usePagePolling from "../../Shared/usePagePooling";

type TPermintaanBarangKeluarIndexProps = {
    data: TBarangKeluar[];
    auth: any;
};

const Index: React.FC<TPermintaanBarangKeluarIndexProps> = (props) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const handleDelete = (uuid: string, reference: string) => {
        return useModal({
            type: "confirm",
            content: `Apakah anda yakin ingin menghapus ${reference}?`,
            okText: "Yakin",
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
            title: "Total Kuantitas",
            dataIndex: "total_quantity",
            key: "total_quantity",
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
                    case "Dieksekusi":
                        return <Tag color="blue">{record.status}</Tag>;
                    default:
                        return <Tag color="grey">{record.status}</Tag>;
                }
            },
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

    const userRole = props?.auth?.user?.roles?.[0];
    const isStaffToko = ["staff_toko", "admin_sistem"].includes(userRole);

    const showActions = isStaffToko
        ? [
              <Link href={Route.CreatePermintaanBarangKeluar}>
                  <Button
                      icon={<PlusSquareOutlined />}
                      type="primary"
                      size="large"
                  >
                      Tambah Permintaan
                  </Button>
              </Link>,
          ]
        : [];
    return (
        <RootLayout
            type="main"
            title="Permintaan Barang Keluar"
            actions={showActions}
        >
            <Table dataSource={props.data} columns={columns} />;
        </RootLayout>
    );
};

export default Index;
