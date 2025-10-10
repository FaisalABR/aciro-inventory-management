import RootLayout from "../../Layouts/RootLayout";
import React from "react";
import { TBarangKeluar } from "../../Types/entities";
import {
    Button,
    Card,
    Descriptions,
    DescriptionsProps,
    Table,
    Tag,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useModal } from "../../Shared/hooks";
import { router } from "@inertiajs/react";
import { Route, route } from "../../Common/Route";
import TextArea from "antd/es/input/TextArea";

type TDetailPermintaanBarangKeluarProps = {
    data: TBarangKeluar;
    auth: any;
};

const Detail: React.FC<TDetailPermintaanBarangKeluarProps> = (props) => {
    const { data, auth } = props;

    const handleVerification = () => {
        return useModal({
            type: "confirm",
            content: `Apakah anda yakin verifikasi ${data?.nomor_referensi}?`,
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.VerifikasiPermintaanKeluar, {
                        uuid: data?.uuid,
                    }),
                );
            },
        });
    };

    const handleReject = () => {
        let reason = "";
        return useModal({
            type: "confirm",
            content: (
                <div>
                    <p>Apakah anda yakin menolak {data?.nomor_referensi}?</p>
                    <TextArea
                        rows={3}
                        style={{ marginTop: "1rem" }}
                        placeholder="Masukkan alasan penolakan"
                        onChange={(e) => (reason = e.target.value)} // simpan ke variabel
                    />
                </div>
            ),
            okText: "Yakin",
            cancelText: "Batal",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => {
                router.put(
                    route(Route.TolakPermintaanKeluar, {
                        uuid: data?.uuid,
                    }),
                    { reason },
                );
            },
        });
    };

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
            key: data?.tanggal_keluar,
            label: "Tanggal Keluar",
            children: data?.tanggal_keluar,
        },
        {
            key: data?.status,
            label: "Status",
            children: data?.status,
        },
        {
            key: "verifikasi kepala toko" + data?.uuid,
            label: "Verifikasi Kepala Toko",
            children: data?.kepala_toko_menolak ? (
                <Tag color="red">Ditolak</Tag>
            ) : data?.verifikasi_kepala_toko ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: "verifikasi kepala gudang" + data?.uuid,
            label: "Verifikasi Kepala Gudang",
            children: data?.kepala_gudang_menolak ? (
                <Tag color="red">Ditolak</Tag>
            ) : data?.verifikasi_kepala_gudang ? (
                <Tag color="green">Disetujui</Tag>
            ) : (
                <Tag color="orange">Belum Verifikasi</Tag>
            ),
        },
        {
            key: data?.user?.name,
            label: "Permintaan oleh",
            children: data?.user?.name,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan",
            children: data?.catatan,
        },
        {
            key: data?.catatan || "catatan",
            label: "Catatan Penolakan",
            children: data?.catatan_penolakan,
        },
    ];

    const columns: ColumnsType = [
        {
            title: "Nama Barang",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Kuantitas",
            dataIndex: "quantity",
            key: "quantity",
        },
    ];

    const dataTable = data?.items.map((item) => {
        return { ...item, key: item?.barang_id, name: item?.barangs.name };
    });

    const userRole = auth?.user?.roles?.[0];
    const isKepala = ["kepala_toko", "kepala_gudang", "admin_sistem"].includes(
        userRole,
    );
    const isDisabled =
        ["Dieksekusi", "Ditolak"].includes(data?.status) ||
        (userRole === "kepala_toko" && data?.verifikasi_kepala_toko) ||
        (userRole === "kepala_gudang" && data?.verifikasi_kepala_gudang);

    const showActions = isKepala
        ? [
              <Button
                  key="verify"
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={handleVerification}
                  disabled={isDisabled}
              >
                  Verifikasi
              </Button>,
              <Button
                  key="reject"
                  danger
                  type="primary"
                  size="large"
                  icon={<CloseCircleOutlined />}
                  onClick={handleReject}
                  disabled={isDisabled}
              >
                  Tolak
              </Button>,
          ]
        : [];

    return (
        <RootLayout
            type="main"
            title="Detail Permintaan Barang Keluar"
            actions={showActions}
        >
            <Card style={{ marginBottom: "1rem" }}>
                <Descriptions
                    title="Informasi Permintaan Barang Keluar"
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
