import React, { useMemo, useState } from "react";
import RootLayout from "../../../Layouts/RootLayout";
import { Paginate, TSupplier } from "../../../Types/entities";
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
import { debounce } from "lodash";

type TSupplierIndexProps = {
    data: Paginate<TSupplier>;
    filters: {
        search: string;
    };
};

const Supplier: React.FC<TSupplierIndexProps> = ({ data, filters }) => {
    const [search, setSearch] = useState(filters.search || "");

    const debounceSearch = useMemo(
        () =>
            debounce((value: any) => {
                router.get(
                    Route.MasterSupplier,
                    { search: value, page: 1 },
                    { preserveState: true },
                );
            }, 500),
        [],
    );

    const handleSearch = (e: any) => {
        const value = e.target.value;

        setSearch(value);
        debounceSearch(value);
    };

    const handleChangePage = (page: any, pageSize: any) => {
        router.get(
            Route.MasterSupplier,
            { search, page, per_page: pageSize },
            { preserveState: true },
        );
    };

    const handleDeleteSupplier = (uuid: string, name: string) => {
        return useModal({
            type: "confirm",
            content: (
                <p>
                    Apakah anda yakin ingin menghapus <b>{name}</b>?
                </p>
            ),
            okText: "Yakin",
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
                    </div>
                );
            },
        },
    ];

    const supplierData = data?.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });
    return (
        <RootLayout
            type="main"
            title="Kelola Supplier"
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
                placeholder="Cari supplier berdasarkan nama"
                style={{ marginBottom: "1rem" }}
                value={search}
                onChange={handleSearch}
            />
            <Table
                dataSource={supplierData ? supplierData : []}
                columns={columns}
                pagination={{
                    current: data.current_page,
                    total: data.total,
                    pageSize: data.per_page,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                    onChange: handleChangePage,
                }}
            />
        </RootLayout>
    );
};

export default Supplier;
