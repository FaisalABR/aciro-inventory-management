import { Flex, Input, Select, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RootLayout from "../Layouts/RootLayout";
import React from "react";
import { record } from "zod";
import { ColumnsType } from "antd/es/table";
import { formatRupiah } from "../Shared/utils";

const dataSource = [
    {
        key: "1",
        name: "Indomie Soto",
        quantity: 20,
        potensi_penjualan: 200000,
        rop: 10,
        itr: null,
        status_rop: "In Stock",
        status_itr: null,
    },
    {
        key: "2",
        name: "Indomie Goreng",
        quantity: 10,
        potensi_penjualan: 220000,
        rop: 12,
        itr: null,
        status_rop: "Need Restock",
        status_itr: null,
    },
    {
        key: "3",
        name: "Goriorio",
        quantity: 100,
        potensi_penjualan: 3200000,
        rop: 30,
        itr: 4.12,
        status_rop: "In Stock",
        status_itr: "Fast Moving",
    },
];

const columns: ColumnsType = [
    {
        title: "Name",
        dataIndex: "name",
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
                case "Out of Stock":
                    return <Tag color="red">{record.status_rop}</Tag>;
            }
        },
    },
    {
        title: "ITR",
        dataIndex: "itr",
        key: "itr",
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
            }
        },
    },
];

const Stock: React.FC = () => {
    return (
        <RootLayout type="main" title="Stock Barang">
            <Flex gap="small" style={{ marginBottom: "1.5rem" }}>
                <Select
                    style={{ width: "15%" }}
                    size="large"
                    options={[
                        {
                            value: "jack",
                            label: "Jack",
                        },
                        {
                            value: "lucy",
                            label: "Lucy",
                        },
                        {
                            value: "tom",
                            label: "Tom",
                        },
                    ]}
                />
                <Select
                    style={{ width: "15%" }}
                    size="large"
                    options={[
                        {
                            value: "jack",
                            label: "Jack",
                        },
                        {
                            value: "lucy",
                            label: "Lucy",
                        },
                        {
                            value: "tom",
                            label: "Tom",
                        },
                    ]}
                />
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Cari barang berdasarkan nama"
                />
            </Flex>
            <Table dataSource={dataSource} columns={columns} />;
        </RootLayout>
    );
};

export default Stock;
