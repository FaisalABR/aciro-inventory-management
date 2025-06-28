import { Button, Input, Table } from "antd";
import React from "react";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Link, router } from "@inertiajs/react";
import { route, Route } from "../../Common/Route";
import { ColumnsType } from "antd/es/table";
import { TUser } from "../../Types/entities";
import { generateRolesName } from "../../Shared/utils";
import RootLayout from "../../Layouts/RootLayout";
import { useModal } from "../../Shared/modal";

type TUserIndexProps = {
    data: TUser[];
};

const Index: React.FC<TUserIndexProps> = ({ data }) => {
    const handleDeleteUser = (uuid: string) => {
        return useModal({
            type: "confirm",
            title: "Konfirmasi",
            content: "Apakah anda yakin ingin menghapus?",
            okText: "Yes",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
                danger: true,
            },
            onOk: () => {
                router.delete(
                    route(Route.DeleteUser, {
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
            title: "Roles",
            dataIndex: "roles",
            key: "roles",
            render: (_, record) => {
                const role = record.roles[0].name || "";
                return generateRolesName(role);
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
                            href={route(Route.EditUser, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() => handleDeleteUser(record.uuid)}
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

    const userData = data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    return (
        <RootLayout
            type="main"
            title="Kelola User"
            actions={[
                <Link href={Route.CreateUser}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah User
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari orang berdasarkan nama"
                style={{ marginBottom: "1rem" }}
            />
            <Table dataSource={userData ? userData : []} columns={columns} />;
        </RootLayout>
    );
};

export default Index;
