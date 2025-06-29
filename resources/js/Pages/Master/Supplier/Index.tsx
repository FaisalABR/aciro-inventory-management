import React from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { TSupplier } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";
import { Link, router } from "@inertiajs/react";
import { Route, route } from "../../../Common/Route";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Input } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";

type TSupplierIndexProps = {
    data: TSupplier[];
};

const Supplier: React.FC<TSupplierIndexProps> = (props) => {
    const handleDeleteSupplier = (uuid: string, name: string) => {
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
                    route(Route.DeleteMasterSupplier, {
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
            title: "Contact Person",
            dataIndex: "contactPerson",
            key: "contactPerson",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "No Whatsapp",
            dataIndex: "noWhatsapp",
            key: "noWhatsapp",
        },
        {
            title: "Kota",
            dataIndex: "kota",
            key: "kota",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href={route(Route.EditMasterSupplier, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDeleteSupplier(record.uuid, record.name)
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

    const supplierData = props.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });
    return (
        <RootLayout
            type="main"
            title="Master Supplier"
            actions={[
                <Link href={Route.CreateMasterSupplier}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Supplier
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari satuan berdasarkan supplier"
                style={{ marginBottom: "1rem" }}
            />
            <Table
                dataSource={supplierData ? supplierData : []}
                columns={columns}
            />
        </RootLayout>
    );
};

export default Supplier;
