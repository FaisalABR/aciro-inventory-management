import React, { useMemo, useState } from "react";
import RootLayout from "../../../Layouts/RootLayout";
import usePagePolling from "../../../Shared/usePagePooling";
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
import { Paginate, TKategori } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";
import { debounce } from "lodash";

type TKategoriIndexProps = {
    data: Paginate<TKategori>;
    filters: {
        search: string;
    };
};

const Kategori: React.FC<TKategoriIndexProps> = ({ data, filters }) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const [search, setSearch] = useState(filters.search || "");

    const debounceSearch = useMemo(
        () =>
            debounce((value: any) => {
                router.get(
                    Route.MasterKategori,
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
            Route.MasterKategori,
            { search, page, per_page: pageSize },
            { preserveState: true },
        );
    };

    const handleDeleteKategori = (uuid: string, name: string) => {
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
                    route(Route.DeleteMasterKategori, {
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
            title: "Kode",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Deskripsi",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link
                            href={route(Route.EditMasterKategori, {
                                uuid: record.uuid,
                            })}
                        >
                            <Button>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <Button
                            onClick={() =>
                                handleDeleteKategori(record.uuid, record.name)
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

    const kategoriData = data?.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    return (
        <RootLayout
            type="main"
            title="Kelola Kategori"
            actions={[
                <Link href={Route.CreateMasterKategori}>
                    <Button
                        icon={<PlusSquareOutlined />}
                        type="primary"
                        size="large"
                    >
                        Tambah Kategori
                    </Button>
                </Link>,
            ]}
        >
            <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Cari kategori berdasarkan nama"
                style={{ marginBottom: "1rem" }}
                value={search}
                onChange={handleSearch}
            />
            <Table
                dataSource={kategoriData ? kategoriData : []}
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

export default Kategori;
