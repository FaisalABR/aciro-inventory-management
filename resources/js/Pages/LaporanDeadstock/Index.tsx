import React, { useState } from "react";
import RootLayout from "../../Layouts/RootLayout";
import { useModal } from "../../Shared/hooks";
import { Link, router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";
import Table, { ColumnsType } from "antd/es/table";
import { Button, DatePicker, Flex, Form, Input, Modal } from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { TPurchaseOrder } from "../../Types/entities";

type TDeadstockIndexProps = {
    data: TPurchaseOrder[];
};

const DeadstockIndex: React.FC<TDeadstockIndexProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns: ColumnsType = [
        {
            title: "Nomor Referensi",
            dataIndex: "nomor_referensi",
            key: "nomor_referensi",
        },
        {
            title: "Periode Mulai",
            dataIndex: "periode_mulai",
            key: "periode_mulai",
        },
        {
            title: "Periode Akhir",
            dataIndex: "periode_akhir",
            key: "periode_akhir",
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
                            href={route(Route.LaporanDeadstocDetail, {
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
                    route(Route.DeletePurchaseOrder, {
                        uuid,
                    }),
                );
            },
        });
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            router.post(Route.CreateLaporanDeadstock, values);

            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <RootLayout
            type="main"
            title="Laporan Deadstock"
            actions={[
                <Button
                    icon={<PlusSquareOutlined />}
                    type="primary"
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                >
                    Buat Laporan Deadstock
                </Button>,
            ]}
        >
            <Table dataSource={data} columns={columns} />;
            <Modal
                title="Tambah Data"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Simpan"
                cancelText="Batal"
            >
                <Form form={form} layout="vertical">
                    <Flex gap="small">
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Periode Mulai wajib diisi",
                                },
                            ]}
                            name="periode_mulai"
                            label="Periode Mulai"
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Periode Akhir wajib diisi",
                                },
                            ]}
                            name="periode_akhir"
                            label="Periode Akhir"
                        >
                            <DatePicker />
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </RootLayout>
    );
};

export default DeadstockIndex;
