import { Button, Card, DatePicker, Flex, Space, Typography } from "antd";
import React from "react";
import Layout, { Content } from "antd/es/layout/layout";
import RootLayout from "../Layouts/RootLayout";
import {
    DownloadOutlined,
    PrinterFilled,
    ProductOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { router } from "@inertiajs/react";
import { Route } from "../Common/Route";
import { pdf } from "@react-pdf/renderer";
import PDFLaporanBarangMasuk from "./PDFLaporanBarangMasuk";
import PDFLaporanBarangKeluar from "./PDFLaporanBarangKeluar";
const { RangePicker } = DatePicker;

const { Title } = Typography;

type TDashboardProps = {
    data: any;
};

const Home: React.FC<TDashboardProps> = ({ data }) => {
    const [dateRange, setDateRange] = React.useState<[any, any] | null>(null);

    const barangMasuk = data?.graph?.barangMasuk.map((item: any) => ({
        nama: item.nama,
        value: Number(item.value), // pastikan number
    }));

    console.log("barangMasuk", barangMasuk);

    const barangKeluar = data?.graph?.barangKeluar.map((item: any) => ({
        nama: item.nama,
        value: Number(item.value), // pastikan number
    }));

    const config = {
        data: barangMasuk,
        xField: "nama", // sumbu X menampilkan nama barang
        yField: "value", // sumbu Y menampilkan jumlah masuk
        colorField: "#1890ff", // warna batang
    };

    const barangKeluarConfig = {
        data: barangKeluar,
        xField: "nama", // sumbu X menampilkan nama barang
        yField: "value", // sumbu Y menampilkan jumlah masuk
        colorField: "#FF0000", // warna batang
    };

    const handleDownload = async () => {
        try {
            const periodeMulai = dateRange?.[0]?.format("YYYY-MM-DD") ?? null;
            const periodeAkhir = dateRange?.[1]?.format("YYYY-MM-DD") ?? null;

            const blob = await pdf(
                <PDFLaporanBarangMasuk
                    data={data?.barangMasuk}
                    title="Laporan Barang Masuk"
                    periodeMulai={periodeMulai}
                    periodeAkhir={periodeAkhir}
                />,
            ).toBlob();

            // ✅ Nama file dinamis
            const fileName = `Laporan_Barang_Masuk_${periodeMulai ?? "semua"}_${periodeAkhir ?? "semua"}.pdf`;

            const url = URL.createObjectURL(blob);

            // --- Opsi 2: Trigger download file juga ---
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName; // ✅ Nama file yang kamu tentukan
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating PDF for print:", error);
        }
    };

    const handleDownloadBarangKeluar = async () => {
        const periodeMulai = dateRange?.[0]?.format("YYYY-MM-DD") ?? null;
        const periodeAkhir = dateRange?.[1]?.format("YYYY-MM-DD") ?? null;
        try {
            const blob = await pdf(
                <PDFLaporanBarangKeluar
                    data={data?.barangKeluar}
                    title="Laporan Barang Keluar"
                    periodeMulai={periodeMulai}
                    periodeAkhir={periodeAkhir}
                />,
            ).toBlob();
            // ✅ Nama file dinamis
            const fileName = `Laporan_Barang_Keluar_${periodeMulai ?? "semua"}_${periodeAkhir ?? "semua"}.pdf`;

            const url = URL.createObjectURL(blob);

            // --- Opsi 2: Trigger download file juga ---
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName; // ✅ Nama file yang kamu tentukan
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating PDF for print:", error);
        }
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
                        placeholder={["Periode Awal", "Periode Akhir"]}
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
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{ width: "100%", marginBottom: "2rem" }}
                    >
                        <Title level={3} style={{ marginBottom: "0" }}>
                            Barang Masuk
                        </Title>
                        <Button
                            type="default"
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                        >
                            Download Laporan Barang Masuk
                        </Button>
                    </Flex>
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
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{ width: "100%", marginBottom: "2rem" }}
                    >
                        <Title level={3} style={{ marginBottom: "0" }}>
                            Barang Keluar
                        </Title>
                        <Button
                            type="default"
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadBarangKeluar}
                        >
                            Download Laporan Barang Keluar
                        </Button>
                    </Flex>
                    <Column {...barangKeluarConfig} />
                </Content>
            </Layout>
        </RootLayout>
    );
};

export default Home;
