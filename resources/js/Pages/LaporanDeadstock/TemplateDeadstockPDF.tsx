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
}) => {
    const parseTgl = (tglString: string) => {
        if (!tglString) return null; // Handle null/undefined input

        // Contoh tglString: "23-10-2025 04:00:20"
        const [tglBagian, _] = tglString.split(" ");

        // Pecah bagian tanggal DD-MM-YYYY
        const [hari, bulan, tahun] = tglBagian.split("-");

        // Susun ulang menjadi YYYY-MM-DD
        return `${tahun}-${bulan}-${hari}`;
    };

    const hitungSelisihHari = (tanggalAwal: string, tanggalAkhir: string) => {
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const tanggalMulaiBersih = parseTgl(tanggalAwal);
        const tanggalMulai = new Date(tanggalMulaiBersih!);
        const tanggalExpired = new Date(tanggalAkhir);
        tanggalMulai.setHours(0, 0, 0, 0);
        tanggalExpired.setHours(0, 0, 0, 0);
        const diffTime = tanggalExpired.getTime() - tanggalMulai.getTime();
        const selisihHari = Math.ceil(diffTime / MS_PER_DAY);
        return selisihHari;
    };
    return (
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

                <View style={styles.section}>
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
                                <Text style={styles.cell}>
                                    {item.barang.name}
                                </Text>
                                <Text style={styles.cell}>{item.itr}</Text>
                                <Text style={styles.cell}>
                                    {item.persediaan_awal}
                                </Text>
                                <Text style={styles.cell}>
                                    {item.persediaan_akhir}
                                </Text>
                                <Text style={styles.cell}>
                                    {item.total_keluar}
                                </Text>
                                <Text style={styles.cell}>{item.status}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={styles.cell}>Barang</Text>
                        <Text style={styles.cell}>Tanggal Expired</Text>
                        <Text style={styles.cell}>Sisa Umur Simpan (Hari)</Text>
                    </View>

                    {deadstock.related_expired.map((item: any, idx: number) => (
                        <View key={idx} style={styles.row}>
                            <Text style={styles.cell}>{item.barangs.name}</Text>
                            <Text style={styles.cell}>
                                {item.tanggal_expired}
                            </Text>
                            <Text style={styles.cell}>
                                {hitungSelisihHari(
                                    deadstock?.created_at,
                                    item.tanggal_expired,
                                )}
                            </Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};
