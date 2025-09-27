import { Button, Card, DatePicker, Flex, Space, Typography } from "antd";
import React from "react";
import Layout, { Content } from "antd/es/layout/layout";
import RootLayout from "../Layouts/RootLayout";
import { ProductOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { router } from "@inertiajs/react";
import { Route } from "../Common/Route";
const { RangePicker } = DatePicker;

const { Title } = Typography;

type TDashboardProps = {
    data: any;
};

const Home: React.FC<TDashboardProps> = ({ data }) => {
    const [dateRange, setDateRange] = React.useState<[any, any] | null>(null);

    const barangMasuk = data?.graph?.barangMasuk.map((item) => ({
        nama: item.nama,
        value: Number(item.value), // pastikan number
    }));

    const barangKeluar = data?.graph?.barangKeluar.map((item) => ({
        nama: item.nama,
        value: Number(item.value), // pastikan number
    }));

    const config = {
        data: barangMasuk,
        xField: "nama", // sumbu X menampilkan nama barang
        yField: "value", // sumbu Y menampilkan jumlah masuk
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        tooltip: {
            showMarkers: true,
            formatter: (datum: any) => ({
                name: datum.nama,
                value: datum.value,
            }),
        },
        meta: {
            nama: { alias: "Nama Barang" },
            value: { alias: "Jumlah Masuk" },
        },
        color: "#1890ff", // warna batang
    };

    const barangKeluarConfig = {
        data: barangKeluar,
        xField: "nama", // sumbu X menampilkan nama barang
        yField: "value", // sumbu Y menampilkan jumlah masuk
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        tooltip: {
            showMarkers: true,
            formatter: (datum: any) => ({
                name: datum.nama,
                value: datum.value,
            }),
        },
        meta: {
            nama: { alias: "Nama Barang" },
            value: { alias: "Jumlah Masuk" },
        },
        color: "#1890ff", // warna batang
    };

    return (
        <RootLayout type="main" title="Dashboard Inventori Management">
            <Layout>
                <Content>
                    <Flex align="center" gap="middle" wrap>
                        {data?.cards?.map((item: any) => (
                            <Card
                                variant="borderless"
                                style={{
                                    width: "100%",
                                    flex: 1,
                                    cursor: "pointer",
                                }}
                            >
                                <Flex align="center" gap="small">
                                    <div
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            backgroundColor: "#FFCB61",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ProductOutlined
                                            style={{
                                                fontSize: "32px",
                                                color: "white",
                                            }}
                                        />
                                    </div>
                                    <Space direction="vertical">
                                        <Title level={5}>{item.title}</Title>
                                        <Typography
                                            style={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            {item.total}
                                        </Typography>
                                    </Space>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                </Content>
                <Content
                    style={{
                        backgroundColor: "white",
                        marginTop: "2rem",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                        format="YYYY-MM-DD"
                    />
                    <Button
                        type="primary"
                        htmlType="button"
                        style={{
                            marginLeft: "1rem",
                        }}
                        onClick={() => {
                            if (!dateRange) return;
                            const [start, end] = dateRange;
                            // Kirim ke server via Inertia
                            router.get(
                                Route.Dashboard,
                                {
                                    periode_mulai: start.format("YYYY-MM-DD"),
                                    periode_akhir: end.format("YYYY-MM-DD"),
                                },
                                {
                                    preserveState: true,
                                },
                            );
                        }}
                    >
                        Filter
                    </Button>
                </Content>
                <Content
                    style={{
                        backgroundColor: "white",
                        marginTop: "2rem",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <Title level={3} style={{ marginBottom: "2rem" }}>
                        Barang Masuk
                    </Title>
                    <Column {...config} />
                </Content>
                <Content
                    style={{
                        backgroundColor: "white",
                        marginTop: "2rem",
                        padding: "20px",
                        borderRadius: "12px",
                    }}
                >
                    <Title level={3} style={{ marginBottom: "2rem" }}>
                        Barang Keluar
                    </Title>
                    <Column {...barangKeluarConfig} />
                </Content>
            </Layout>
        </RootLayout>
    );
};

export default Home;
