# Veloura — Tumblr Vintage & Classy Shop

Stack: HTML, CSS, JavaScript (no build step).  
Fitur:
- Slider produk terlaris (maksimal 5 item).
- Klik produk → animasi “terbang” ke keranjang (fly-to-cart).
- Keranjang belanja (drawer) + total.
- Tombol Checkout.
- Checkout modal dengan progress bar interaktif (Keranjang → Alamat → Pembayaran → Review → Selesai).
- Testimoni pelanggan + form tambah testimoni (localStorage).
- Form Kritik & Saran (localStorage).
- Alamat toko: Jl. Riveside 56, Jakarta.
- Palet warna sesuai brief (Velvet/Mauve/Cream/Rose/Charcoal).
- Aset SVG bawaan (logo + mock produk).

## Struktur Folder
```
Veloura-Shop/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── slider.js
│   └── app.js
└── assets/
    ├── svg/
    │   ├── veloura-logo.svg
    │   ├── hero-art.svg
    │   ├── cart.svg
    │   ├── checkout.svg
    │   ├── prod-candle.svg
    │   ├── prod-headband.svg
    │   ├── prod-necklace.svg
    │   ├── prod-poster.svg
    │   ├── prod-socks.svg
    │   └── prod-tote.svg
    └── img/  (opsional untuk gambar raster di masa depan)
```

## Cara Pakai
1. Ekstrak ZIP lalu buka `index.html` di browser (atau host di GitHub Pages).
2. Semua data (testimoni/feedback/keranjang) disimpan lokal via `localStorage`.
3. Ganti produk di `js/data.js` sesuai kebutuhanmu.
4. Ganti warna di `css/style.css` (variabel `:root`).

Happy shipping! ✨
