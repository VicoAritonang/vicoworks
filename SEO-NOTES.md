# SEO project Vicoworks

Audit: 7 Oktober 2026. Target utama implementasi ini adalah halaman project di **vicoworks.com**, terutama `https://vicoworks.com/projects/nusaverify`. Aplikasi demo di domain lain adalah URL terpisah dan perlu optimasi di repository masing-masing jika ingin domain aplikasi yang tampil di hasil pencarian.

## Hasil audit publik dan repository

| Temuan sebelum perubahan | Implikasi |
| --- | --- |
| Homepage, `/projects`, dan `/projects/nusaverify` mengembalikan 200 | Halaman dapat diambil melalui HTTP dalam audit ini. Ini belum membuktikan status indeks Google. |
| Judul NusaVerify adalah `NusaVerify – case study by Vico Aritonang \| Vico Aritonang – AI Engineer` | Nama pemilik berulang; fungsi project belum jelas di judul. |
| Twitter title project masih judul homepage | Metadata berbagi belum konsisten dengan project yang dibuka. Ini perbaikan preview, bukan faktor ranking Google yang dijanjikan. |
| Lima case study sudah punya canonical sendiri, konten statis, breadcrumb, byline, dan internal link | Fondasi sudah tersedia; tidak perlu membangun ulang fitur atau desain. |
| `/projects/handlerindonesia` mengembalikan 404 | Belum bisa menjadi landing page hasil pencarian. HandlerIndonesia saat ini hanya muncul dalam daftar/kartu dengan tautan aplikasi. |
| Sitemap berisi lima URL case study | HandlerIndonesia, gmail-sender, dan Vicoworks belum punya halaman detail; jangan menambahkan URL 404 ke sitemap. |
| `lastmod` semua halaman mengikuti waktu build | Deploy tanpa perubahan konten memberikan sinyal tanggal yang kurang akurat. |
| Robots mengizinkan crawler pencarian dan crawler AI; `/llms.txt` serta `/llms-full.txt` sudah ada | Menambah daftar bot atau file AI bukan pekerjaan utama berikutnya. |

Audit ini tidak mengakses Google Search Console, Bing Webmaster Tools, atau data volume keyword. Hasil pencarian publik bukan bukti pasti suatu URL belum diindeks. Penyebab pasti jika NusaVerify belum muncul harus diperiksa lewat URL Inspection.

## Perubahan yang sudah dikerjakan

- Judul dan deskripsi khusus untuk Avagenc, Datafact, NusaVerify, ACEP, dan riset robot tutor; nama project, kegunaan, dan Vico Aritonang terhubung dalam snippet.
- Judul memakai `absolute` agar tidak ditambahi template nama pemilik lagi.
- Open Graph dan Twitter memakai judul/deskripsi project yang sama; screenshot project dipakai jika tersedia, dengan gambar profil situs sebagai fallback.
- Structured data menghubungkan `WebPage → CreativeWork/ScholarlyArticle → Person`, memakai ID project yang konsisten dengan homepage dan daftar project. Breadcrumb tetap tersedia. Tidak menambahkan rating, harga, tanggal, FAQ, atau klaim produk yang tidak ada dalam konten.
- `lastmod` waktu build dihapus. Blog tetap memakai tanggal konten yang tersedia. Jika kelak ada tanggal pembaruan yang dicatat secara eksplisit, gunakan tanggal tersebut.
- Pemeriksaan HTTP yang dapat diulang: `npm run seo:check -- https://vicoworks.com`.

Desain, CSS, konten tampak, alur klik, fitur, dan konfigurasi database tidak diubah. HTML bagian utama kelima case study dibandingkan dengan produksi dan identik setelah script structured data dikeluarkan dari perbandingan.

## Pemetaan query dan tujuan

Ini peta intent berdasarkan isi project, bukan hasil riset volume pencarian berbayar.

| Prioritas | Query | URL tujuan | Catatan |
| --- | --- | --- | --- |
| 1 | `vico aritonang nusaverify`, `vico nusaverify` | `/projects/nusaverify` | Target awal paling spesifik untuk menghubungkan orang dan project. |
| 2 | `nusaverify`, `nusa verify` | `/projects/nusaverify` | Nama produk saja juga dapat memunculkan domain aplikasinya. |
| 2 | `vico verifikasi berita`, `vico cek fakta investasi` | `/projects/nusaverify` | Isi aktual berfokus pada klaim investasi/keuangan, bukan semua jenis berita. |
| 1 | `vico aritonang avagenc`, `vico avagenc` | `/projects/avagenc` | Assistant AI dengan banyak agen. |
| 1 | `vico aritonang datafact`, `vico datafact` | `/projects/datafact` | Studi implementasi AI dan arsitektur AWS. |
| 1 | `vico aritonang acep`, `vico acep solar` | `/projects/acep` | Perencanaan surya dan baterai. |
| 1 | `vico aritonang robot tutor` | `/projects/robot-tutor-rl` | Penelitian reinforcement learning. |
| Belum ada landing page | `handler indonesia`, `handlerindonesia`, `vico handler indonesia` | Saat ini `/projects`; kandidat `/projects/handlerindonesia` | Perlu halaman khusus berbasis fakta project untuk target URL detail. |

Interpretasi strategi: query gabungan nama dan project lebih sempit daripada query kebutuhan umum seperti `verifikasi berita` atau `platform ekspor UMKM`. Untuk pola seperti `pdf to word`, pengunjung biasanya menginginkan alat yang langsung menyelesaikan tugas. Maka, aplikasi NusaVerify cocok menjadi target jangka panjang query penggunaan, sedangkan portfolio cocok untuk nama project, pembuat, arsitektur, dan studi kasus.

Konten sekarang berbahasa Inggris; metadata mengikuti bahasa halaman. Untuk memperkuat intent Indonesia di tahap konten berikutnya, tambahkan paragraf Indonesia yang benar-benar terlihat atau halaman terjemahan yang lengkap. Contoh draft berdasarkan isi yang ada: “NusaVerify adalah project verifikasi informasi investasi yang dikembangkan oleh Vico Aritonang. Enam agen AI memeriksa klaim dengan sumber BEI, OJK, dan media finansial.” Draft ini **belum dipasang** agar konten tampak tetap utuh. Jangan menaruh variasi keyword sebagai teks tersembunyi atau membuat banyak halaman tipis untuk query yang sama. [Panduan judul Google](https://developers.google.com/search/docs/appearance/title-link), [kebijakan spam](https://developers.google.com/search/docs/essentials/spam-policies).

## Setelah deploy Vercel

1. Deploy perubahan ini melalui alur Git/Vercel biasa. Implementasi ini belum dipush atau dideploy otomatis.
2. Jalankan `npm run seo:check -- https://vicoworks.com`. Perintah ini hanya membaca situs. Harus lolos untuk lima project sebelum meminta crawl ulang.
3. Di Google Search Console, inspeksi `https://vicoworks.com/projects/nusaverify`. Periksa apakah URL sudah diindeks, waktu crawl terakhir, user-declared canonical, dan Google-selected canonical. Canonical yang diharapkan adalah URL NusaVerify itu sendiri.
4. Jalankan **Test live URL**, pastikan konten dapat diakses, lalu **Request indexing**. Ulangi untuk project prioritas lain dan `/projects`. Tidak perlu memverifikasi domain ulang atau mengganti alamat sitemap yang sudah berhasil. Request berulang tidak mempercepat crawl. Google menyatakan proses dapat membutuhkan beberapa hari sampai beberapa minggu dan tidak menjamin indexing. [Panduan recrawl Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
5. Periksa sitemap yang sudah terdaftar: status sukses dan lima URL detail tercakup. `lastmod` bersifat opsional; Google meminta tanggal perubahan signifikan yang akurat, bukan waktu deploy. [Panduan sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
6. Uji URL menggunakan [Rich Results Test](https://search.google.com/test/rich-results). Breadcrumb dapat diperiksa di sana; tidak semua tipe schema menghasilkan rich result. `CreativeWork` tidak menjanjikan kartu aplikasi di Google. [Structured data Google](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
7. Pantau mingguan di Search Console: filter page tepat `/projects/nusaverify`, kemudian query yang mengandung `nusaverify`, `nusa verify`, atau `vico`. Catat impressions, clicks, CTR, dan average position; bandingkan periode 28 hari saat datanya cukup. Periksa apakah halaman yang muncul sesuai tujuan. [Penggunaan Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).

Jika statusnya `Discovered – currently not indexed`, evaluasi penemuan URL dan akses crawl. Jika `Crawled – currently not indexed`, periksa isi, duplikasi, dan kecocokan halaman. Jika Google memilih canonical lain, bandingkan canonical, redirect, serta internal link antar-URL. Jangan mengubah URL yang sudah benar hanya karena hasil belum berubah beberapa hari.

## AI Search dan penguatan di luar repository

Google AI Search tetap bergantung pada fondasi SEO, konten bernilai, dan akses indeks. Tidak diperlukan schema khusus AI; `llms.txt` tidak meningkatkan ranking Google. File yang sudah ada boleh dipertahankan sebagai representasi tambahan, tetapi bukan pengganti halaman HTML. [Panduan resmi optimasi generative AI Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Perplexity mendokumentasikan `PerplexityBot` untuk pencarian dan menyarankan akses crawler tidak diblokir. Robots saat ini mengizinkannya, tetapi aturan firewall/challenge Vercel tetap perlu diperiksa jika log menunjukkan penolakan. Allow di robots tidak menjamin halaman akan dipilih sebagai sumber jawaban. [Dokumentasi crawler Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

Daftarkan situs dan sitemap di Bing Webmaster Tools jika belum. Script `npm run indexnow` yang sudah tersedia dapat dijalankan setelah deploy untuk memberi tahu mesin pencari peserta tentang perubahan URL. Ini bukan Google Indexing API dan bukan jaminan indexing atau kutipan AI. Periksa respons sukses dari layanan; jangan menganggap log jumlah URL sebagai bukti semua URL masuk indeks. [Dokumentasi IndexNow](https://www.indexnow.org/documentation).

Rekomendasi editorial di luar repository: tambahkan tautan case study di README repo NusaVerify dan tautan “Built by Vico Aritonang” pada aplikasi jika sesuai. Gunakan tautan ke `/projects/nusaverify` untuk konteks project. Satu posting pengalaman membangun project di profil Anda juga dapat membantu pembaca menemukan penjelasan aslinya. Ini belum dilakukan dalam pekerjaan ini.

Jangan samakan canonical aplikasi dan portfolio secara otomatis: aplikasi dan case study memenuhi kebutuhan berbeda. Masing-masing sebaiknya mendeskripsikan isi halamannya sendiri. Judul dan deskripsi hasil Google tetap dipilih oleh sistem Google dan bisa berbeda dari metadata. [Panduan snippet Google](https://developers.google.com/search/docs/appearance/snippet).

## Validasi lokal

- `npm run build`: berhasil, termasuk pemeriksaan TypeScript dan lima route statis project.
- ESLint untuk seluruh file kode yang diubah: berhasil.
- `npm run seo:check -- http://localhost:3100`: berhasil untuk lima project; memeriksa HTTP, canonical, metadata unik, OG/Twitter, graph JSON-LD, gambar, internal link, sitemap, dan 404.
- Perbandingan HTML `<main>` produksi dengan build lokal untuk lima case study: identik, kecuali structured data yang memang diubah.
- Build mencatat DNS Supabase lokal tidak terjangkau. Fallback yang sudah ada digunakan; integrasi database tidak dapat divalidasi dari lingkungan ini. Route case study tetap berhasil dibuat tanpa database. Peringatan dependency baseline dan konvensi middleware juga berasal dari setup yang sudah ada.

Keberhasilan pemeriksaan teknis berarti implementasi siap untuk crawl, bukan bukti ranking atau indexing. Status aktual harus dikonfirmasi setelah deploy melalui Search Console.
