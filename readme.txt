TOKO KUE NAILA - WEBSITE DEMO
============================

ISI FOLDER
- index.html  : struktur halaman website
- style.css   : desain dan tampilan responsif
- script.js   : katalog, pencarian, kategori, akun demo, keranjang, dan checkout WhatsApp

CARA MENJALANKAN DI VS CODE
1. Ekstrak file ZIP ke folder yang mudah ditemukan.
2. Buka Visual Studio Code.
3. Pilih File > Open Folder, lalu pilih folder "toko-kue-naila".
4. Buka file index.html.
5. Jalankan dengan ekstensi Live Server (klik kanan index.html > Open with Live Server).
   Jika belum memasang Live Server: buka Extensions di VS Code, cari "Live Server" oleh Ritwick Dey, lalu Install.
6. Website akan terbuka di browser.

PENGATURAN YANG WAJIB DIGANTI
Buka script.js, cari bagian:
const STORE = {
  whatsapp: "6281234567890",
  phoneDisplay: "08xx-xxxx-xxxx",
  address: "Alamat Toko Kue Naila, tambahkan alamat lengkap di sini"
};
Ganti nomor WhatsApp dengan nomor toko dalam format internasional tanpa tanda +.
Ganti nomor tampilan dan alamat toko.

MENGGANTI PRODUK
Di script.js, cari const products. Ubah nama, kategori, harga (angka tanpa titik), deskripsi, tag, dan URL foto.
Kategori yang digunakan: Cake, Roti, Cookies, Dessert.

FITUR DEMO DAN BATASAN
- Akun, password, dan keranjang disimpan di localStorage browser. Ini hanya untuk demonstrasi lokal.
- Jangan gunakan password pribadi/asli. Untuk website produksi, autentikasi wajib memakai backend dan penyimpanan password yang aman (hash), bukan localStorage.
- Checkout membuka WhatsApp dengan ringkasan pesanan. Pelanggan dan toko tetap perlu mengonfirmasi ketersediaan, ongkir, dan pembayaran.
- Foto produk memakai URL gambar online sehingga browser membutuhkan koneksi internet.
- Data produk dan akun belum terhubung ke database atau panel admin.
