import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    PDFDownloadLink,
} from "@react-pdf/renderer";

// Example: export default PdfBarangMasukTable and also a small wrapper to download
// Expected prop `data` shape (array):
// [
//   {
//     nama: 'Barang A',
//     total_masuk: 22,
//     rincian_per_tanggal: [
//       { tanggal: '2025-10-01', jumlah: 15 },
//       { tanggal: '2025-10-05', jumlah: 7 },
//     ],
//   },
//   ...
// ]

const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 6,
        fontWeight: "bold",
    },
    period: {
        fontSize: 10,
        textAlign: "center",
        marginBottom: 8,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "33.3333%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: "#bfbfbf",
        padding: 6,
        backgroundColor: "#f2f2f2",
    },
    tableCol: {
        width: "33.3333%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: "#e0e0e0",
        padding: 6,
    },
    nestedList: {
        marginTop: 4,
    },
    nestedItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
    },
    rightAlign: {
        textAlign: "right",
    },
    footer: {
        marginTop: 12,
        fontSize: 9,
        textAlign: "right",
        color: "#666",
    },
    smallMuted: {
        fontSize: 8,
        color: "#666",
    },
});

const PDFLaporanBarangKeluar = ({
    data = [],
    title = "Laporan Barang Keluar",
    periodeMulai,
    periodeAkhir,
}) => (
    <Document>
        <Page size="A4" style={styles.page} wrap>
            <View style={styles.header} fixed>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.period}>
                    {periodeMulai === null && periodeAkhir === null
                        ? "Semua Periode"
                        : `Periode: ${periodeMulai} — ${periodeAkhir}`}
                </Text>
            </View>

            <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                        <Text>Nama Barang</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Total Masuk</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Rincian Per Tanggal</Text>
                    </View>
                </View>

                {/* Data Rows */}
                {data.length === 0 ? (
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text>Tidak ada data</Text>
                        </View>
                        <View style={styles.tableCol} />
                        <View style={styles.tableCol} />
                    </View>
                ) : (
                    data.map((barang, idx) => (
                        <View
                            style={styles.tableRow}
                            key={`row-${idx}`}
                            wrap={false}
                        >
                            <View style={styles.tableCol}>
                                <Text>{barang.nama}</Text>
                            </View>

                            <View style={styles.tableCol}>
                                <Text style={styles.rightAlign}>
                                    {barang.total_keluar ?? 0}
                                </Text>
                            </View>

                            <View style={[styles.tableCol, { padding: 6 }]}>
                                {/* Nested per-tanggal list */}
                                {Array.isArray(barang.rincian_per_tanggal) &&
                                barang.rincian_per_tanggal.length > 0 ? (
                                    <View style={styles.nestedList}>
                                        {barang.rincian_per_tanggal.map(
                                            (r, i) => (
                                                <View
                                                    style={styles.nestedItem}
                                                    key={`tgl-${i}`}
                                                >
                                                    <Text>{r.tanggal}</Text>
                                                    <Text
                                                        style={
                                                            styles.rightAlign
                                                        }
                                                    >
                                                        {r.jumlah}
                                                    </Text>
                                                </View>
                                            ),
                                        )}
                                    </View>
                                ) : (
                                    <Text style={styles.smallMuted}>-</Text>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </View>

            <Text
                style={styles.footer}
                render={({ pageNumber, totalPages }) =>
                    `Halaman ${pageNumber} / ${totalPages}`
                }
                fixed
            />
        </Page>
    </Document>
);

export default PDFLaporanBarangKeluar;
