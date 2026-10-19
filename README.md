# SK@S · SK Sungai Tiram

Sistem pengurusan Kurikulum (3.1), Kokurikulum (3.2) dan Hal Ehwal Murid (3.3).

**Mulakan dengan [PANDUAN-MULA-DI-SINI.md](PANDUAN-MULA-DI-SINI.md).**

1. Pasang `appscript/Code.gs` dalam Apps Script.
2. Jalankan `setupSystem()` dan salin kata laluan admin sementara daripada Execution log.
3. Deploy Web App versi baharu: Execute as **Me**, akses **Anyone**.
4. Muat naik fail laman dan folder `assets` ke GitHub Pages.
5. Log masuk dan tukar kata laluan sementara.

Tiada npm install atau build diperlukan. PWA menggunakan path relatif untuk menyokong GitHub Pages subfolder.

Fail `config.js` telah diisi dengan URL API/CSV yang dibekalkan. Jika mencipta deployment Google yang baharu, gantikan `apiUrl` di situ.

Butang **Lihat demonstrasi** menggunakan data contoh dalam memori dan tidak menulis ke Google Sheets.
