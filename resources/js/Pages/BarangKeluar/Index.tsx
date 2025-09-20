import React, { useState } from "react";
import RootLayout from "../../Layouts/RootLayout";
import { Link, router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { Button, Modal, notification, Table, Tooltip } from "antd";
import { PlusSquareOutlined, SwapOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { TBarangKeluar } from "../../Types/entities";
import { useModal } from "../../Shared/hooks";

type TBarangKeluarIndexProps = {
    data: TBarangKeluar[];
};

const Index: React.FC<TBarangKeluarIndexProps> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [warnings, setWarnings] = useState([]);
    const [selectedUuid, setSelectedUuid] = useState("");

    const handleCheckExecute = async (uuid: string) => {
        setSelectedUuid(uuid);
        try {
            const res = await fetch(
                `/api${route(Route.CekEksekusiBarangKeluar, {
                    uuid,
                })}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                },
            );
            const data = await res.json();
            setWarnings(data.warnings);
            setIsModalOpen(true);
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Gagal memeriksa stok dan ROP",
            });
        }
    };

    const handleConfirmExecute = () => {
        if (!selectedUuid) return;
        router.post(
            route(Route.EksekusiBarangKeluar, { uuid: selectedUuid }),
            {},
            {
                onSuccess: () => {
                    notification.success({
                        message: "Eksekusi berhasil",
                        description:
                            "Barang keluar berhasil dieksekusi. PO otomatis dibuat jika stok kena ROP.",
                    });
                    setIsModalOpen(false);
                },
                onError: () => {
                    notification.error({
                        message: "Gagal",
                        description:
                            "Terjadi kesalahan saat eksekusi barang keluar",
                    });
                },
            },
        );
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
            title: "Catatan",
            dataIndex: "catatan",
            key: "catatan",
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
                        <Tooltip
                            placement="topLeft"
                            title={
                                record.status === "Dieksekusi"
                                    ? "Barang sudah dieksekusi!"
                                    : null
                            }
                        >
                            <Button
                                onClick={() => handleCheckExecute(record.uuid)}
                                type="primary"
                                icon={<SwapOutlined />}
                                disabled={record.status === "Dieksekusi"}
                            >
                                Eksekusi
                            </Button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return (
        <RootLayout type="main" title=" Barang Keluar">
            <Table
                dataSource={props.data}
                columns={columns}
                rowKey="uuid"
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            dataSource={record.items}
                            rowKey="uuid"
                            pagination={false}
                            columns={[
                                {
                                    title: "Nama Barang",
                                    dataIndex: ["barangs", "name"],
                                },
                                { title: "Quantity", dataIndex: "quantity" },
                            ]}
                        />
                    ),
                }}
            />
            <Modal
                open={isModalOpen}
                title="Konfirmasi Eksekusi Barang Keluar"
                onCancel={() => setIsModalOpen(false)}
                onOk={handleConfirmExecute}
                okText="Lanjut Eksekusi"
                cancelText="Batal"
            >
                {warnings.length > 0 ? (
                    <ul>
                        {warnings.map((w, i) => (
                            <li key={i} style={{ color: "red" }}>
                                {w}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Tidak ada masalah, barang keluar aman dieksekusi.</p>
                )}
            </Modal>
        </RootLayout>
    );
};

export default Index;
