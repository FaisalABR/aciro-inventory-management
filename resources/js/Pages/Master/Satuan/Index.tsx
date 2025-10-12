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
import { Paginate, TSatuan } from "../../../Types/entities";
import { useModal } from "../../../Shared/hooks";
import { debounce } from "lodash";

type TSatuanIndexProps = {
    data: Paginate<TSatuan>;
    filters: {
        search: string;
    };
};

const Satuan: React.FC<TSatuanIndexProps> = ({ data, filters }) => {
    usePagePolling({ interval: 5000, only: ["data"] });
    const [search, setSearch] = useState(filters.search || "");

    const debounceSearch = useMemo(
        () =>
            debounce((value: any) => {
                router.get(
                    Route.MasterSatuan,
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
            Route.MasterSatuan,
            { search, page, per_page: pageSize },
            { preserveState: true },
        );
    };

    const handleDeleteSatuan = (uuid: string, name: string) => {
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
                    </div>
                );
            },
        },
    ];

    const satuanData = data?.data?.map((item) => {
        return { ...item, key: item?.uuid };
    });

    return (
        <RootLayout
            type="main"
            title="Kelola Satuan"
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
                value={search}
                onChange={handleSearch}
            />
            <Table
                dataSource={satuanData ? satuanData : []}
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

export default Satuan;
