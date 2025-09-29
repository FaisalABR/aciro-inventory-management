import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// styling mirip CSS tapi versi react-pdf
const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    header: { fontSize: 18, marginBottom: 20 },
    text: { fontSize: 12, marginBottom: 5 },
    table: { width: "auto" },
    row: { flexDirection: "row" },
    cell: { flex: 1, border: "1pt solid #000", padding: 5, fontSize: 10 },
});

export const TemplateDeadstockPDF: React.FC<{ deadstock: any }> = ({
    deadstock,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Laporan Deadstock</Text>

            <View style={styles.section}>
                <Text style={styles.text}>
                    Nomor: {deadstock.nomor_referensi}
                </Text>
                <Text style={styles.text}>
                    Periode Mulai: {deadstock?.periode_mulai}
                </Text>
                <Text style={styles.text}>
                    Periode Akhir: {deadstock?.periode_akhir}
                </Text>
                <Text style={styles.text}>
                    Dibuat pada: {deadstock?.created_at}
                </Text>
            </View>

            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.cell}>Barang</Text>
                    <Text style={styles.cell}>Nilai ITR</Text>
                    <Text style={styles.cell}>Persediaan Awal</Text>
                    <Text style={styles.cell}>Persediaan Akhir</Text>
                    <Text style={styles.cell}>Total Keluar</Text>
                    <Text style={styles.cell}>Status</Text>
                    Status
                </View>

                {deadstock.items.map((item: any, idx: number) => (
                    <View key={idx} style={styles.row}>
                        <Text style={styles.cell}>{item.barang.name}</Text>
                        <Text style={styles.cell}>{item.itr}</Text>
                        <Text style={styles.cell}>{item.persediaan_awal}</Text>
                        <Text style={styles.cell}>{item.persediaan_akhir}</Text>
                        <Text style={styles.cell}>{item.total_keluar}</Text>
                        <Text style={styles.cell}>{item.status}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);
