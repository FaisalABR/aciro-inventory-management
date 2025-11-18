<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Purchase Order</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            padding: 30px;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
        }

        .section {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            font-size: 10px;
            text-align: left;
        }

        .qr-container {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .signature {
            width: 100px;
            height: 50px;
            margin-top: 10px;
        }

        .qr-image {
            width: 100px;
            height: 100px;
            margin-top: 5px;
        }
    </style>
</head>

<body>
    <h1>Purchase Order</h1>

    <div class="section">
        <p><strong>Nomor:</strong> {{ $po->nomor_referensi }}</p>
        <p><strong>Supplier:</strong> {{ $po->supplier->name ?? '-' }}</p>
        <p><strong>Tanggal:</strong> {{ $po->tanggal_order }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Barang</th>
                <th>Quantity</th>
                <th>Harga Beli</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($po->items as $item)
            <tr>
                <td>{{ $item->barang->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->harga_beli, 0, ',', '.') }}</td>
                <td>{{ number_format($item->harga_beli * $item->quantity, 0, ',', '.') }}</td>
            </tr>
            @endforeach

            @php
            $totalKeseluruhan = $po->items->sum(function ($item) {
            return $item->harga_beli * $item->quantity;
            });
            @endphp

            <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total Keseluruhan</td>
                <td style="font-weight: bold;">{{ number_format($totalKeseluruhan, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="qr-container">
    </div>
</body>

</html>