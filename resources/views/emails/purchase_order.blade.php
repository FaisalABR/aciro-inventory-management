@php
$formatted = \Carbon\Carbon::parse($po->tanggal_order)->translatedFormat('d F Y');
@endphp

<p>
    Halo {{ $po->supplier->name }},
</p>

<p>
    Kami dari <strong>Koperasi Karya Bersama Aciro</strong> ingin melakukan pemesanan sesuai Purchase Order (PO):
</p>

<p>
    Nomor PO: <strong>{{ $po->nomor_referensi }}</strong><br>
    Tanggal: <strong>{{ $formatted }}</strong>
</p>

<p>
    Berikut adalah lampiran dokumen Purchase Order:<br>
</p>

<p>
    Mohon dapat dikonfirmasi dan diproses ketersediaannya.<br>
    Terima kasih atas kerjasamanya.
</p>

<p>
    Hormat kami,<br>
    <strong>Tim Procurement</strong><br>
    Koperasi Karya Bersama Aciro
</p>