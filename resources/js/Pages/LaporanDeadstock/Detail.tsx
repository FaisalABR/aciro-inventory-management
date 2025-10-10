import RootLayout from "../../Layouts/RootLayout";
import React from "react";
import { TLaporanDeadstock } from "../../Types/entities";
import { Button, Card, Descriptions, DescriptionsProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { PrinterFilled } from "@ant-design/icons";
import { TemplateDeadstockPDF } from "./TemplateDeadstockPDF";
import { pdf } from "@react-pdf/renderer";

type TDetailLaporanDeadstockProps = {
    data: TLaporanDeadstock;
};

const Detail: React.FC<TDetailLaporanDeadstockProps> = (props) => {
    const { data } = props;

    const descItems: DescriptionsProps["items"] = [
        {
            key: data?.uuid,
            label: "UUID",
            children: data?.uuid,
        },
        {
            key: data?.nomor_referensi,
            label: "Nomor Referensi",
            children: data?.nomor_referensi,
        },
        {
            key: data?.periode_mulai,
            label: "Periode Mulai",
            children: data?.periode_mulai,
        },
        {
            key: data?.periode_akhir,
            label: "Periode Akhir",
            children: data?.periode_akhir,
        },
    ];

    const columns: ColumnsType = [
        {
            title: "Nama Barang",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Nilai ITR",
            dataIndex: "itr",
            key: "itr",
        },
        {
            title: "Persediaan Awal",
            dataIndex: "persediaan_awal",
            key: "persediaan_awal",
        },
        {
            title: "Persediaan Akhir",
            dataIndex: "persediaan_akhir",
            key: "persediaan_akhir",
        },
        {
            title: "Total Keluar",
            dataIndex: "total_keluar",
            key: "total_keluar",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
    ];

    const dataTable = data?.items.map((item) => {
        return { ...item, key: item?.barang_id, name: item?.barang.name };
    });

    const handlePrint = async () => {
        if (data) {
            try {
                const blob = await pdf(
                    <TemplateDeadstockPDF deadstock={data} />,
                ).toBlob();
                const url = URL.createObjectURL(blob);
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.src = url;

                // Add load event listener before appending iframe
                iframe.onload = () => {
                    try {
                        // Wait for iframe to be ready
                        setTimeout(() => {
                            if (iframe.contentWindow) {
                                iframe.contentWindow.print();
                            }
                        }, 1000);

                        // Remove iframe after printing is done or cancelled
                        window.addEventListener(
                            "afterprint",
                            () => {
                                document.body.removeChild(iframe);
                                URL.revokeObjectURL(url);
                            },
                            { once: true },
                        );
                    } catch (error) {
                        console.error("Print window error:", error);
                        document.body.removeChild(iframe);
                        URL.revokeObjectURL(url);
                    }
                };

                document.body.appendChild(iframe);
            } catch (error) {
                console.error("Error generating PDF for print:", error);
            }
        }
    };

    return (
        <RootLayout
            type="main"
            title="Detail Laporan Deadstock"
            actions={[
                <Button
                    type="primary"
                    size="large"
                    icon={<PrinterFilled />}
                    onClick={handlePrint}
                >
                    Print
                </Button>,
            ]}
        >
            <Card style={{ marginBottom: "1rem" }}>
                <Descriptions
                    title="Informasi Header Deadstock"
                    layout="vertical"
                    bordered
                    items={descItems}
                />
            </Card>
            <Card>
                <Table columns={columns} dataSource={dataTable} />
            </Card>
        </RootLayout>
    );
};

export default Detail;
