import React from "react";
import RootLayout from "../../Layouts/RootLayout";
import usePagePolling from "../../Shared/usePagePooling";
import { useModal } from "../../Shared/hooks";
import { Link, router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Tag } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { TPurchaseOrder } from "../../Types/entities";
import { formatRupiah } from "../../Shared/utils";

type TPurchaseOrderIndexProps = {
    data: TPurchaseOrder[];
    auth: any;
};

const PurchaseIndex: React.FC<TPurchaseOrderIndexProps> = ({ data, auth }) => {
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
                    route(Route.DeletePurchaseOrder, {
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
            title: "Tanggal Order",
            dataIndex: "tanggal_order",
            key: "tanggal_order",
        },

        {
            title: "Supplier",
            dataIndex: ["supplier", "name"],
            key: "supplier",
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
            title: "Total Pembelian",
            dataIndex: "total_pembelian",
            key: "total_pembelian",
            render: (_, record) => {
                return formatRupiah(record.total_pembelian);
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                switch (record.status) {
                    case "DRAFT":
                        return <Tag color="grey">{record.status}</Tag>;
                    case "BUTUH VERIFIKASI":
                        return <Tag color="orange">{record.status}</Tag>;
                    case "VERIFIKASI SEBAGIAN":
                        return <Tag color="lime">{record.status}</Tag>;
                    case "TERVEFIKASI":
                        return <Tag color="green">{record.status}</Tag>;
                    case "TERKIRIM":
                        return <Tag color="geekblue">{record.status}</Tag>;
                    case "KONFIRMASI SUPPLIER":
                        return <Tag color="magenta">{record.status}</Tag>;
                    case "BARANG DIKIRIM":
                        return <Tag color="gold">{record.status}</Tag>;
                    case "MENUNGGU PEMBAYARAN":
                        return <Tag color="cyan">{record.status}</Tag>;
                    case "SUDAH DIBAYAR":
                        return <Tag color="cyan">{record.status}</Tag>;
                    case "BARANG SAMPAI":
                        return <Tag color="blue">{record.status}</Tag>;
                }
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
                            href={
                                record.status !== "DRAFT"
                                    ? "#"
                                    : route(Route.EditPurchaseOrder, {
                                          uuid: record.uuid,
                                      })
                            }
                        >
                            <Button disabled={record.status !== "DRAFT"}>
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
                            href={route(Route.PurchaseOrderDetail, {
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

    const userRole = auth?.user?.roles?.[0];
    const isStaffPengadaan = ["admin_pengadaan", "admin_sistem"].includes(
        userRole,
    );

    const showActions = isStaffPengadaan
        ? [
              <Link href={Route.CreatePurchaseOrder}>
                  <Button
                      icon={<PlusSquareOutlined />}
                      type="primary"
                      size="large"
                  >
                      Tambah Purchase Order
                  </Button>
              </Link>,
          ]
        : [];

    return (
        <RootLayout
            type="main"
            title="Kelola Purchase Order"
            actions={showActions}
        >
            <Table dataSource={data} columns={columns} />;
        </RootLayout>
    );
};

export default PurchaseIndex;
