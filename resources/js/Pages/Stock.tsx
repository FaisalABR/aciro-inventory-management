import { Flex, Input, Select, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RootLayout from "../Layouts/RootLayout";
import React from "react";

const dataSource = [
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
];

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
    },
];

const Stock = () => {
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
