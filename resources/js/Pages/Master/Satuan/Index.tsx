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
import { TSatuan } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";

type TSatuanIndexProps = {
    data: TSatuan[];
};

const Satuan: React.FC<TSatuanIndexProps> = (props) => {
    const handleDeleteSatuan = (uuid: string, name: string) => {
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
                    route(Route.DeleteMasterSatuan, {
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
            title: "Deskripsi",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Kode",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href={route(Route.EditMasterSatuan, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDeleteSatuan(record.uuid, record.name)
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

    const satuanData = props.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    return (
        <RootLayout
            type="main"
            title="Master Satuan"
            actions={[
                <Link href={Route.CreateMasterSatuan}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Satuan
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari satuan berdasarkan nama"
                style={{ marginBottom: "1rem" }}
            />
            <Table
                dataSource={satuanData ? satuanData : []}
                columns={columns}
            />
        </RootLayout>
    );
};

export default Satuan;
