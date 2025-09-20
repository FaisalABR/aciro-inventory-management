import { Flex, Input, Select, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RootLayout from "../Layouts/RootLayout";
import React, { useMemo, useState } from "react";
import { record } from "zod";
import { ColumnsType } from "antd/es/table";
import { formatRupiah } from "../Shared/utils";
import { Paginate, TStock } from "../Types/entities";
import { router } from "@inertiajs/react";
import { Route } from "../Common/Route";
import { debounce } from "lodash";

type TStockIndexProps = {
    data: Paginate<TStock>;
    filters: {
        search: string;
        statusROP: string;
        statusITR: string;
    };
};

const Stock: React.FC<TStockIndexProps> = ({ data, filters }) => {
    const [search, setSearch] = useState(filters.search || "");
    const [statusROP, setStatusROP] = useState(filters.statusROP);
    const [statusITR, setStatusITR] = useState(filters.statusITR || "");

    const columns: ColumnsType = [
        {
            title: "Name",
            dataIndex: ["barangs", "name"],
            key: "name",
        },
        {
            title: "Kuantitas",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Potensi Penjualan",
            dataIndex: "potensi_penjualan",
            key: "potensi_penjualan",
            render: (_, record) => {
                return formatRupiah(record.potensi_penjualan);
            },
        },
        {
            title: "ROP",
            dataIndex: "rop",
            key: "rop",
        },
        {
            title: "Status ROP",
            dataIndex: "status_rop",
            key: "status_rop",
            render: (_, record) => {
                switch (record.status_rop) {
                    case "In Stock":
                        return <Tag color="green">{record.status_rop}</Tag>;
                    case "Need Restock":
                        return <Tag color="orange">{record.status_rop}</Tag>;
                    case "Out Of Stock":
                        return <Tag color="red">{record.status_rop}</Tag>;
                }
            },
        },
        {
            title: "ITR",
            dataIndex: "itr",
            key: "itr",
            render: (text) => text ?? <Tag color="grey">Not Evaluated</Tag>,
        },
        {
            title: "Status ITR",
            dataIndex: "status_itr",
            key: "status_itr",
            render: (_, record) => {
                switch (record.status_itr) {
                    case "Fast Moving":
                        return <Tag color="green">{record.status_itr}</Tag>;
                    case "Slow Moving":
                        return <Tag color="orange">{record.status_itr}</Tag>;
                    case "Deadstock":
                        return <Tag color="red">{record.status_itr}</Tag>;
                    default:
                        return <Tag color="grey">Not Evaluated</Tag>;
                }
            },
        },
    ];

    const stockData = data?.data?.map((item, idx) => {
        return { ...item, key: idx };
    });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    Route.StockBarang,
                    { search: value, page: 1 },
                    { preserveState: true },
                );
            }),
        [],
    );

    const handleSearch = (e: any) => {
        const value = e.target.value;

        setSearch(value);
        debounceSearch(value);
    };

    const handleStatusROP = (value: string) => {
        setStatusROP(value);
        router.get(
            Route.StockBarang,
            { statusROP: value, page: 1 },
            { preserveState: true },
        );
    };

    const handleStatusITR = (value: string) => {
        setStatusITR(value);
        router.get(
            Route.StockBarang,
            { statusITR: value, page: 1 },
            { preserveState: true },
        );
    };

    return (
        <RootLayout type="main" title="Stock Barang">
            <Flex gap="small" style={{ marginBottom: "1.5rem" }}>
                <Select
                    placeholder="select status ROP"
                    style={{ width: "15%" }}
                    onChange={handleStatusROP}
                    size="large"
                    value={statusROP}
                    allowClear
                    options={[
                        {
                            value: "In Stock",
                            label: "In Stock",
                        },
                        {
                            value: "Need Restock",
                            label: "Need Restock",
                        },
                        {
                            value: "Out Of Stock",
                            label: "Out Of Stock",
                        },
                    ]}
                />
                <Select
                    placeholder="select status ITR"
                    style={{ width: "15%" }}
                    size="large"
                    allowClear
                    value={statusITR}
                    onChange={handleStatusITR}
                    options={[
                        {
                            value: "Fast Moving",
                            label: "Fast Moving",
                        },
                        {
                            value: "Slow Moving",
                            label: "Slow Moving",
                        },
                        {
                            value: "Deadstock",
                            label: "Deadstock",
                        },
                    ]}
                />
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Cari barang berdasarkan nama"
                    value={search}
                    onChange={handleSearch}
                />
            </Flex>
            <Table dataSource={stockData} columns={columns} />;
        </RootLayout>
    );
};

export default Stock;
