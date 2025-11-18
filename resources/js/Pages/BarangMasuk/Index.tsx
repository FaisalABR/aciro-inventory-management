import React from "react";
import RootLayout from "../../Layouts/RootLayout";
import { Link, router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { Button, Table, Tag } from "antd";
import usePagePolling from "../../Shared/usePagePooling";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { TBarangMasuk } from "../../Types/entities";
import { useModal } from "../../Shared/hooks";
import { formatRupiah } from "../../Shared/utils";

type TBarangIndexProps = {
    data: TBarangMasuk[];
    auth: any;
};

const BarangMasuk: React.FC<TBarangIndexProps> = (props) => {
    // Poll page data every 5s (only reload 'data' prop)
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
                    route(Route.DeleteBarangMasuk, {
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
            title: "Tanggal Masuk",
            dataIndex: "tanggal_masuk",
            key: "tanggal_masuk",
        },
        {
            title: "Supplier",
            dataIndex: "supplier_name",
            key: "supplier_name",
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
                    case "Dieksekusi":
                        return <Tag color="blue">{record.status}</Tag>;
                    default:
                        return <Tag color="grey">{record.status}</Tag>;
                }
            },
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
            title: "Total Harga",
            dataIndex: "total_harga",
            key: "total_harga",
            render: (_, record) => {
                return formatRupiah(record.total_harga);
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        {userRole === "admin_sistem" && (
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
                        )}
                        <Link
                            href={route(Route.BarangMasukDetail, {
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

    const formattedData = props?.data?.map((item) => ({
        ...item,
        key: item.uuid,
    }));

    const userRole = props?.auth?.user?.roles?.[0];
    const isAdminGudang = ["admin_gudang", "admin_sistem"].includes(userRole);

    const showActions = isAdminGudang
        ? [
              <Link href={Route.CreateBarangMasuk}>
                  <Button
                      icon={<PlusSquareOutlined />}
                      type="primary"
                      size="large"
                  >
                      Tambah Barang Masuk
                  </Button>
              </Link>,
          ]
        : [];

    return (
        <RootLayout type="main" title="Barang Masuk" actions={showActions}>
            <Table dataSource={formattedData} columns={columns} />
        </RootLayout>
    );
};

export default BarangMasuk;
