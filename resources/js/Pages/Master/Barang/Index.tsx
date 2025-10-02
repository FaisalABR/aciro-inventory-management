import React, { useMemo, useState } from "react";
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
import { Paginate, TBarang } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";
import { formatRupiah } from "../../../Shared/utils";
import { debounce } from "lodash";

type TBarangIndexProps = {
    data: Paginate<TBarang>;
    filters: {
        search: string;
    };
};

const Barang: React.FC<TBarangIndexProps> = ({ data, filters }) => {
    const [search, setSearch] = useState(filters.search || "");

    const debouncedSearch = useMemo(
        () =>
            debounce(
                (value: any) =>
                    router.get(
                        Route.MasterBarang,
                        { search: value, page: 1 },
                        { preserveState: true },
                    ),
                500,
            ),
        [],
    );

    const handleSearch = (e: any) => {
        const value = e.target.value;

        setSearch(value);
        debouncedSearch(value);
    };

    const handleChangePage = (page: any, pageSize: any) => {
        router.get(
            Route.MasterBarang,
            { search, page, per_page: pageSize },
            { preserveState: true },
        );
    };

    const handleDeleteBarang = (uuid: string, name: string) => {
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
                    route(Route.DeleteMasterBarang, {
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
            title: "Supplier",
            dataIndex: "supplier",
            key: "supplier",
            render: (_, record) => {
                return <span>{record.supplier.name}</span>;
            },
        },
        {
            title: "Satuan",
            dataIndex: "satuan",
            key: "satuan",
            render: (_, record) => {
                return <span>{record.satuan.name}</span>;
            },
        },
        {
            title: "Harga Jual",
            dataIndex: "hargaJual",
            key: "hargaJual",
            render: (_, record) => {
                return formatRupiah(record.hargaJual);
            },
        },
        {
            title: "Harga Beli",
            dataIndex: "hargaBeli",
            key: "hargaBeli",
            render: (_, record) => {
                return formatRupiah(record.hargaBeli);
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
                            href={route(Route.EditMasterBarang, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDeleteBarang(record.uuid, record.name)
                            }
                            type="primary"
                            danger
                        >
                            <DeleteOutlined />
                        </Button>
                        <Link
                            href={route(Route.MasterBarangDetail, {
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

    const barangData = data?.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    return (
        <RootLayout
            type="main"
            title="Master Barang"
            actions={[
                <Link href={Route.CreateMasterBarang}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Barang
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari Barang berdasarkan nama"
                style={{ marginBottom: "1rem" }}
                value={search}
                onChange={handleSearch}
            />
            <Table
                dataSource={barangData}
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

export default Barang;
