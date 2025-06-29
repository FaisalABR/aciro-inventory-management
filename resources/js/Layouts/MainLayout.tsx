import {
    BuildOutlined,
    DesktopOutlined,
    FileTextOutlined,
    LeftSquareOutlined,
    LogoutOutlined,
    MoneyCollectOutlined,
    PieChartOutlined,
    RightSquareOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Col, Flex, Layout, Menu, MenuProps, Row, Typography } from "antd";
import React, { useMemo } from "react";
import { Route } from "../Common/Route";
import {
    PERMISSIONS_VIEW_BARANG_KELUAR,
    PERMISSIONS_VIEW_BARANG_MASUK,
    PERMISSIONS_VIEW_DASHBOARD,
    PERMISSIONS_VIEW_KELOLA_USER,
    PERMISSIONS_VIEW_LAPORAN_DEADSTOCK,
    PERMISSIONS_VIEW_MASTER_KATEGORI,
    PERMISSIONS_VIEW_MASTER_ROOT,
    PERMISSIONS_VIEW_MASTER_SATUAN,
    PERMISSIONS_VIEW_MASTER_SUPPLIER,
    PERMISSIONS_VIEW_ORDER,
    PERMISSIONS_VIEW_STOCK,
} from "../Common/Permission";
import { TInertiaProps } from "../Types/intertia";
import { useModal } from "../Shared/hooks";

type TMainLayout = {
    children: React.ReactNode;
    title?: string;
    actions?: React.ReactNode[];
};

type MenuItem = Required<MenuProps>["items"][number] & {
    permission?: string;
    children?: MenuItem[];
};

const { Sider } = Layout;
const { Title } = Typography;

const items: MenuItem[] = [
    {
        key: Route.Dashboard,
        icon: <PieChartOutlined />,
        label: <Link href={Route.Dashboard}>Dashboard</Link>,
        permission: PERMISSIONS_VIEW_DASHBOARD,
    },
    {
        key: Route.BarangMasuk,
        icon: <RightSquareOutlined />,
        label: <Link href={Route.BarangMasuk}>Barang Masuk</Link>,
        permission: PERMISSIONS_VIEW_BARANG_MASUK,
    },
    {
        key: Route.StockBarang,
        icon: <BuildOutlined />,
        label: <Link href={Route.StockBarang}>Stock Barang</Link>,
        permission: PERMISSIONS_VIEW_STOCK,
    },
    {
        key: Route.BarangKeluar,
        icon: <LeftSquareOutlined />,
        label: <Link href={Route.BarangKeluar}>Barang Keluar</Link>,
        permission: PERMISSIONS_VIEW_BARANG_KELUAR,
    },
    {
        key: Route.Order,
        icon: <MoneyCollectOutlined />,
        label: <Link href={Route.Order}>Order</Link>,
        permission: PERMISSIONS_VIEW_ORDER,
    },
    {
        key: Route.KelolaUser,
        icon: <UserOutlined />,
        label: <Link href={Route.KelolaUser}>Kelola User</Link>,
        permission: PERMISSIONS_VIEW_KELOLA_USER,
    },
    {
        key: Route.LaporanDeadstock,
        icon: <FileTextOutlined />,
        label: <Link href={Route.LaporanDeadstock}>Laporan Deadstock</Link>,
        permission: PERMISSIONS_VIEW_LAPORAN_DEADSTOCK,
    },
    {
        key: "6",
        icon: <DesktopOutlined />,
        label: "Data Master",
        permission: PERMISSIONS_VIEW_MASTER_ROOT,
        children: [
            {
                key: Route.MasterSatuan,
                label: <Link href={Route.MasterSatuan}>Data Satuan</Link>,
                permission: PERMISSIONS_VIEW_MASTER_SATUAN,
            },
            {
                key: Route.MasterKategori,
                label: <Link href={Route.MasterKategori}>Data Kategori</Link>,
                permission: PERMISSIONS_VIEW_MASTER_KATEGORI,
            },
            {
                key: Route.MasterSupplier,
                label: <Link href={Route.MasterSupplier}>Data Supplier</Link>,
                permission: PERMISSIONS_VIEW_MASTER_SUPPLIER,
            },
        ],
    },
];

export const MainLayout: React.FC<TMainLayout> = ({
    children,
    title,
    actions,
}) => {
    const { auth } = usePage<TInertiaProps>().props;

    const activeMenuKey = useMemo(
        () => window.location.pathname,
        [window.location.pathname],
    );

    const defaultOpenedKey = useMemo(
        () =>
            items.find((item) => {
                if (!item) return false;

                if ("children" in item) {
                    const openedMenuItem = item.children?.find((chil) => {
                        return chil?.key == activeMenuKey;
                    });

                    return openedMenuItem !== undefined;
                }
            })?.key as string,
        [items, activeMenuKey],
    );

    const handleLogout = () => {
        return useModal({
            type: "confirm",
            title: "Konfirmasi",
            content: "Apakah anda yakin ingin logout?",
            okText: "OK",
            cancelText: "Kembali",
            okType: "danger",
            okButtonProps: {
                type: "primary",
            },
            onOk: () => router.get(Route.AuthLogout),
        });
    };

    const filteredMenuItems = useMemo(() => {
        const permission = auth?.user?.permissions || [];

        return items.filter((item) => permission.includes(item.permission!));
    }, []);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Head title={`${title} | Aciro Inventory Management`} />
            <Sider theme="light">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <div style={{ fontSize: "1rem", padding: "1rem" }}>
                        <h2>Aciro Inventory Management</h2>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Menu
                            selectedKeys={[activeMenuKey]}
                            defaultOpenKeys={[defaultOpenedKey]}
                            items={filteredMenuItems}
                            mode="inline"
                            theme="light"
                            style={{ border: 0 }}
                        />
                        <Menu
                            mode="inline"
                            theme="light"
                            style={{ border: 0 }}
                            items={[
                                {
                                    key: "logout",
                                    label: (
                                        <Link href="#" onClick={handleLogout}>
                                            Logout
                                        </Link>
                                    ),
                                    icon: <LogoutOutlined />,
                                },
                            ]}
                        />
                    </div>
                </div>
            </Sider>
            <Layout style={{ height: "100vh", overflowY: "scroll" }}>
                <Row style={{ width: "100%" }}>
                    <Col span={24} style={{ padding: "2rem 1.5rem" }}>
                        <Flex
                            align="center"
                            justify="space-between"
                            style={{ marginBottom: "1rem" }}
                        >
                            <Title level={2}>{title}</Title>
                            {actions && actions.map((item) => item)}
                        </Flex>
                        {children}
                    </Col>
                </Row>
            </Layout>
        </Layout>
    );
};
