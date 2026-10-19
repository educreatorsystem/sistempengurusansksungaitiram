# SK@S — SEKOLAH KEBANGSAAN SUNGAI TIRAM

Versi 1.0.0 · Aplikasi web responsif + PWA + Google Apps Script.

## 1. Pasang Apps Script dahulu

1. Buka Google Sheet milik sekolah:
   https://docs.google.com/spreadsheets/d/1ln3kviRYg-hShqoNiUl-Q6OqzFrLGoi_nmz7Tbb7pV8/edit
2. Pilih **Extensions → Apps Script**. Gunakan projek Apps Script yang mempunyai URL web app yang diberikan, jika mahu mengekalkan URL yang sama.
3. Salin keseluruhan kandungan **appscript/Code.gs** ke fail **Code.gs** dalam editor. Dalam projek khusus SK@S, gantikan kod API lama. Pastikan tiada fungsi `doGet` / `doPost` lain yang bertindih. Jika projek lama turut digunakan sistem lain, cipta projek baharu untuk SK@S dan kemas kini URL dalam config.js.
4. ID Sheet dan folder Drive telah dimasukkan dalam kod. Akaun yang menjalankan script perlu mempunyai hak menyunting Sheet dan menambah fail dalam folder Drive tersebut.
5. Pilih fungsi **setupSystem** di bahagian atas editor, kemudian tekan **Run**.
6. Berikan kebenaran akses Google Sheets dan Google Drive apabila diminta. Jika akaun sekolah menyekat kebenaran atau akses awam Web App, rujuk pentadbir akaun sekolah.
7. Buka **Execution log**. Salin **nama pengguna admin** dan **kata laluan sementara yang dijana secara rawak**. Kata laluan ini tidak dimasukkan dalam fail laman web.
8. Jalankan setupSystem sekali lagi jika perlu; ia menambah struktur yang belum wujud dan tidak memadam rekod sedia ada. Kata laluan admin hanya dicetak pada penciptaan akaun pertama.

Pilihan manifest: fail **appscript/appsscript.json** turut dibekalkan. Untuk menggunakannya, buka **Project Settings → Show appsscript.json manifest file in editor**, kemudian salin kandungannya. Manifest menetapkan zon masa Asia/Kuala_Lumpur dan kebenaran Sheets/Drive. Tanpa menyalin manifest, Apps Script boleh mengesan kebenaran daripada kod; tetapkan zon masa projek kepada Kuala Lumpur.

## 2. Deploy Web App versi baharu

Untuk mengekalkan URL sedia ada:

1. **Deploy → Manage deployments**.
2. Pilih deployment Web App sedia ada, tekan ikon pensel **Edit**.
3. Pada Version, pilih **New version**.
4. Tetapkan **Execute as: Me** dan **Who has access: Anyone**.
5. Tekan **Deploy**.

**Menekan Save sahaja tidak mengemas kini versi /exec yang sedang digunakan.**

Jika menggunakan projek baharu: **Deploy → New deployment → Web app**, tetapkan pilihan yang sama dan salin URL berakhir **/exec**. Gantikan nilai `apiUrl` dalam **config.js** dengan URL baharu tersebut.

URL awal yang telah dipasang:
https://script.google.com/macros/s/AKfycbzZgVc3KC3bQiZmtGMoZfsZ3pFRl1hOwmMZfXxl6jxMc-jULol5XwrkOgjjVJZaDaDARw/exec

Buka URL /exec dalam tab baharu. Respons yang betul mempunyai:

```json
{"ok":true,"app":"SKAS","version":"1.0.0","school":"SEKOLAH KEBANGSAAN SUNGAI TIRAM","ready":true}
```

Jika `ready` ialah false, jalankan setupSystem dalam projek yang sama. Jika keluar HTML, halaman log masuk Google atau respons sistem lama, semak deployment dan kebenarannya.

## 3. Deploy ke GitHub Pages — cara ringkas

1. Ekstrak ZIP pada komputer.
2. Cipta repository GitHub, contohnya **skas-sk-sungai-tiram**.
3. Muat naik **kandungan** folder sistem ke root repository. Pastikan **index.html berada di root**, bukan di dalam satu lagi folder.
4. Fail laman yang diperlukan:
   - index.html
   - styles.css
   - config.js
   - app.js
   - sw.js
   - manifest.webmanifest
   - folder assets bersama semua kandungannya
   - .nojekyll, jika tersedia semasa muat naik
5. Pergi ke **Settings → Pages**.
6. Source: **Deploy from a branch**.
7. Branch: **main**, folder **/(root)**, kemudian **Save**.
8. Tunggu sehingga GitHub memaparkan URL laman yang diterbitkan. Buka URL HTTPS tersebut.

Fail dalam folder appscript dipasang dalam editor Apps Script; GitHub Pages tidak menjalankan Code.gs.

### Pilihan GitHub Actions

Workflow **.github/workflows/pages.yml** juga disediakan. Jika menggunakan workflow ini, muat naik folder .github dan pilih **Settings → Pages → Source: GitHub Actions**. Workflow akan menyalin fail laman sahaja ke _site sebelum deployment. Gunakan satu kaedah penerbitan yang dipilih.

## 4. Log masuk pertama

1. Buka laman GitHub Pages.
2. Tekan **Uji Sambungan**. Mesej berjaya menandakan endpoint SK@S yang betul memberi respons.
3. Log masuk menggunakan `admin` dan kata laluan sementara daripada Execution log.
4. Tukar kata laluan sementara kepada kata laluan baharu minimum 12 aksara.
5. Buka **Tetapan Sistem → Pengguna** untuk menambah akaun guru dan penyelaras.
6. Untuk penyelaras, pilih skop Standard 3.1, 3.2 atau 3.3 yang ditugaskan.
7. Tetapkan pegawai dan senarai semak pada **Tetapan Sistem → Subtopik**.

Jika terlupa kata laluan admin, pemilik projek boleh menjalankan **resetAdminPassword** dalam editor Apps Script. Kata laluan sementara baharu dicetak dalam Execution log. Sesi admin terdahulu dibatalkan. Fungsi ini tidak boleh dipanggil melalui API awam.

## 5. Aliran kerja harian

**Standard → Subtopik → Tambah Rekod → Simpan Draf → Tambah Evidens → Hantar untuk Semakan → Disahkan / Perlu Pembetulan.**

- Pentadbir boleh melihat dan mengurus semua rekod.
- Penyelaras boleh membaca serta menyemak rekod dalam Standard yang ditugaskan; rekod milik atau ditugaskan kepada mereka juga boleh dibaca.
- Guru melihat rekod milik sendiri atau yang ditugaskan kepada akaunnya.
- Guru boleh mencipta rekod bagi mana-mana Standard. Penyelaras mencipta rekod baharu dalam skop penyelarasan sendiri.
- Guru tidak boleh menyunting rekod yang sedang dihantar atau telah disahkan. Penyemak boleh membuka semula rekod untuk pembetulan.
- Gunakan akaun dan skop yang sesuai untuk rekod bimbingan/kaunseling yang terhad aksesnya.
- Evidens boleh berupa pautan HTTPS atau fail PDF, JPG, PNG, WEBP, DOC/DOCX, XLS/XLSX dan PPT/PPTX. Maksimum **5 MB setiap fail**.
- Sistem tidak menukar fail Drive menjadi awam. Berikan akses fail kepada penyemak melalui perkongsian Google Drive sekolah.
- Memadam rekod atau membuang evidens hanya membuang rujukannya dalam sistem. Fail asal Google Drive dikekalkan.
- Rekod mempunyai nombor revision untuk mengelakkan suntingan serentak menimpa perubahan pengguna lain.
- Jika simpanan tamat masa menunggu, muat semula dan semak rekod sebelum menyimpan sekali lagi. Sistem tidak mengulang permintaan simpan secara automatik.

## 6. Cetak dan simpan PDF

1. Buka rekod, kemudian tekan **Cetak / PDF**; atau buka **Laporan & Analisis**.
2. Pilih tahun dan penapis jika diperlukan.
3. Pilih jenis laporan.
4. Dalam dialog cetakan pelayar, pilih **Save as PDF / Simpan sebagai PDF**.
5. Laporan individu menggunakan A4 potret; jadual senarai dan evidens menggunakan A4 landskap.
6. Jika pelayar menambah URL pada kepala/kaki halaman, nyahaktifkan pilihan Headers and footers dalam dialog cetakan.

Fungsi ini menggunakan cetakan asli pelayar dan tidak membuka popup baharu. Pada telefon, pilihan PDF bergantung pada menu cetakan/kongsi peranti.

Liputan dashboard: bilangan subtopik aktif dengan sekurang-kurangnya satu rekod disahkan ÷ jumlah subtopik aktif × 100%. Angka berdasarkan tahun dan rekod yang pengguna boleh akses. Laporan rumusan turut mengambil kira penapis dipilih. Ini **bukan skor rasmi penilaian SK@S**.

## 7. Pasang PWA

Buka laman GitHub Pages melalui HTTPS terlebih dahulu.

- **Android / Chrome:** menu ⋮ → Install app / Add to Home screen.
- **iPhone / iPad / Safari:** Kongsi → Add to Home Screen → Add.
- **Komputer / Chrome atau Edge:** ikon pemasangan pada bar alamat jika tersedia.

Butang **Pasang Aplikasi** dalam sistem akan membuka permintaan pemasangan jika pelayar menyokongnya, atau memaparkan panduan.

Service worker menyimpan HTML, CSS, JavaScript, font dan aset grafik. **Rekod, kata laluan dan respons API tidak dicache.** Pembukaan kerangka aplikasi di luar talian memerlukan sekurang-kurangnya satu lawatan dalam talian yang berjaya. Log masuk, muat semula data, muat naik dan simpanan memerlukan Internet.

Sesi pengguna disimpan dalam sessionStorage tab pelayar dan biasanya sah sehingga 6 jam; cache pelayan boleh menamatkannya lebih awal. Log masuk semula apabila diminta. Menyahaktifkan pengguna atau menukar kata laluan membatalkan sesi lamanya.

## 8. Struktur Google Sheets

setupSystem mencipta helaian berawalan **SKAS_**:

| Helaian | Kegunaan |
| --- | --- |
| SKAS_Standard | Standard utama, kod dan penerangan |
| SKAS_Subtopik | Subtopik, pegawai dan senarai semak |
| SKAS_Unit_Panitia | Unit, kelab dan panitia |
| SKAS_Rekod_Pelaksanaan | Rekod utama, status, tarikh dan revision |
| SKAS_Evidens | Indeks fail dan pautan evidens |
| SKAS_Semakan | Sejarah keputusan dan maklum balas semakan |
| SKAS_Log_Aktiviti | Jejak aktiviti pengguna |
| SKAS_Tetapan | Nama sekolah, logo dan tahun lalai |

Header dicipta automatik. Jangan tukar nama header atau ID secara manual. Medan checklist dan evidence menggunakan JSON. Gunakan UI untuk mengemas kini rekod.

Akaun pengguna dan hash kata laluan disimpan dalam **Script Properties**, bukan CSV awam atau fail frontend. Tiada kata laluan tetap dibekalkan dalam ZIP.

Helaian sedia ada termasuk gid=0 tidak dipadam. URL CSV asal dikekalkan dalam config.js sebagai rujukan pentadbir sahaja dan tidak diimport secara automatik; semasa pembangunan pautan tersebut memulangkan kandungan kosong. Selepas log masuk admin, buka **Tetapan Sistem → Sambungan → Semak CSV Rujukan** untuk pratonton.

Jika Google Sheet telah diterbitkan ke web, pastikan penerbitan awam dihadkan kepada helaian rujukan yang memang hendak dikongsi. Jangan terbitkan helaian SKAS_ yang mengandungi rekod sekolah atau maklumat sulit.

## 9. Penyelesaian masalah

| Masalah | Tindakan |
| --- | --- |
| Format API tidak sepadan / JSON gagal | Pastikan Code.gs baharu berada dalam projek /exec yang sama; Deploy → Manage deployments → Edit → New version. |
| Failed to fetch / Tidak dapat menghubungi Apps Script | Semak URL /exec, Internet dan akses deployment Anyone. Gunakan URL GitHub Pages HTTPS, bukan fail tempatan. |
| setupSystem gagal pada Drive | Pastikan folder ID 141CECiUmWTbz28f6BIzANZacehH9KriD wujud dan akaun pemilik script boleh menambah fail di dalamnya. |
| Tiada akaun admin dipaparkan dalam log | Ia telah dicipta sebelum ini. Gunakan kata laluan sedia ada atau jalankan resetAdminPassword. |
| Rekod tidak muncul | Semak tahun, penapis, pemilik/penugasan rekod dan skop akaun. |
| Perubahan tidak muncul selepas deploy | Muat semula laman. Untuk versi seterusnya, ubah nama CACHE dalam sw.js. Jika perlu, kosongkan data laman atau pasang semula PWA. |
| Sesi tamat | Log masuk semula. |
| Fail tidak boleh dibuka penyemak | Semak perkongsian fail/folder Google Drive. |
| Apps Script permission / quota error | Semak Executions dalam editor, akaun pemilik dan had perkhidmatan Google. |

## 10. Status pengujian

Kod sintaks JavaScript, struktur PWA dan aliran fungsi diuji secara setempat. Ujian menggunakan simulasi Google Sheets/Drive/Cache untuk mengesahkan simpanan, semakan, akses peranan, evidens, revision dan penamatan sesi. Rendering HTML, carian dan kandungan laporan juga diuji tanpa pelayar.

**Pemasangan kod, autorisasi Google dan deployment sebenar perlu dibuat oleh pemilik akaun. Sambungan baca/tulis akaun Google dan paparan visual pelayar belum diuji secara langsung.** Selepas pemasangan, cipta satu rekod percubaan, tambah satu evidens, hantar semakan dan muat semula untuk mengesahkan sambungan sebenar.

## Rujukan teknikal

- Google Apps Script Web Apps: https://developers.google.com/apps-script/guides/web
- Content Service: https://developers.google.com/apps-script/guides/content
- GitHub Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- PWA installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

Font Plus Jakarta Sans diedarkan di bawah SIL Open Font License; lihat assets/FONT-LICENSE.txt. Lencana sekolah menggunakan imej yang dibekalkan pengguna. Ilustrasi antaramuka dan ikon PWA dibina sebagai grafik vektor/CSS.
