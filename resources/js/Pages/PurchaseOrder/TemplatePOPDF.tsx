// components/PoDocument.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import React from "react";
import { formatRupiah } from "../../Shared/utils";

// styling PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12 },
    header: { fontSize: 18, marginBottom: 20, textAlign: "center" },
    section: { marginBottom: 10 },
    table: { width: "auto", marginTop: 10 },
    row: { flexDirection: "row" },
    cell: { flex: 1, border: "1pt solid #000", padding: 5, fontSize: 10 },
    totalRow: {
        flexDirection: "row",
        borderTop: "2pt solid #000",
        marginTop: 4,
    },
    totalLabel: {
        flex: 2,
        textAlign: "right",
        padding: 5,
        fontSize: 10,
        fontWeight: "bold",
        borderLeft: "1pt solid #000",
        borderBottom: "1pt solid #000",
    },
    totalValue: {
        flex: 1,
        textAlign: "left",
        padding: 5,
        fontSize: 10,
        fontWeight: "bold",
        borderRight: "1pt solid #000",
        borderBottom: "1pt solid #000",
    },
    qrContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signature: { width: 100, height: 50, marginTop: 10 },
});

export const TemplatePOPDF: React.FC<{ po: any; qrData: string }> = ({
    po,
    qrData,
}) => {
    const totalKeseluruhan = po.items.reduce(
        (sum: number, item: any) => sum + item.harga_beli * item.quantity,
        0,
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Purchase Order</Text>

                <View style={styles.section}>
                    <Text>Nomor: {po.nomor_referensi}</Text>
                    <Text>Supplier: {po.supplier?.name}</Text>
                    <Text>Tanggal: {po.tanggal_order}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={styles.cell}>Barang</Text>
                        <Text style={styles.cell}>Quantity</Text>
                        <Text style={styles.cell}>Harga Beli</Text>
                        <Text style={styles.cell}>Total</Text>
                    </View>
                    {po.items.map((item: any, idx: number) => (
                        <View key={idx} style={styles.row}>
                            <Text style={styles.cell}>{item.barang.name}</Text>
                            <Text style={styles.cell}>{item.quantity}</Text>
                            <Text style={styles.cell}>
                                {formatRupiah(item.harga_beli)}
                            </Text>
                            <Text style={styles.cell}>
                                {formatRupiah(item.harga_beli * item.quantity)}
                            </Text>
                        </View>
                    ))}

                    {/* Total keseluruhan */}
                    <View style={styles.totalRow}>
                        {/* Ini seolah-olah colspan 3 kolom */}
                        <Text
                            style={{
                                flex: 3, // gabungan dari 3 kolom pertama
                                textAlign: "right",
                                padding: 5,
                                fontSize: 10,
                                fontWeight: "bold",
                                borderLeft: "1pt solid #000",
                                borderBottom: "1pt solid #000",
                            }}
                        >
                            Total Keseluruhan
                        </Text>

                        {/* Kolom terakhir untuk nilai total */}
                        <Text
                            style={{
                                flex: 1, // kolom ke-4
                                textAlign: "left",
                                padding: 5,
                                fontSize: 10,
                                fontWeight: "bold",
                                borderRight: "1pt solid #000",
                                borderBottom: "1pt solid #000",
                            }}
                        >
                            {formatRupiah(totalKeseluruhan)}
                        </Text>
                    </View>
                </View>

                {/* QRCode & Tanda Tangan */}
                <View style={styles.qrContainer}>
                    <View>
                        <Text>Scan untuk detail PO:</Text>
                        <Image
                            src={qrData}
                            style={{ width: 100, height: 100, marginTop: 5 }}
                        />
                    </View>
                    {/* <View>
                    <Text>Disetujui oleh,</Text>
                    <Image src="/signature.png" style={styles.signature} />
                    <Text>Kepala Gudang</Text>
                </View> */}
                </View>
            </Page>
        </Document>
    );
};
