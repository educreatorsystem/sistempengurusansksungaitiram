# SK@S 2.0 — SK SUNGAI TIRAM

## Kemas kini logo, header dan hover

Tajuk utama ialah **SISTEM STANDARD KUALITI PENDIDIKAN MALAYSIA**. Logo yang dibekalkan berada dalam `assets/logo-sistem.png`, turut digunakan pada header, menu sisi dan ikon PWA. Lencana sekolah dikekalkan berasingan. Animasi hover menyokong tetapan kurangkan pergerakan pada peranti.

**Jika Apps Script v2 sudah dipasang:** kemas kini fail laman GitHub dan keseluruhan folder `assets` sahaja. Tidak perlu menjalankan setupSystem atau deploy semula Apps Script untuk perubahan rupa ini. Ikuti langkah pemasangan penuh di bawah hanya untuk pemasangan baharu atau naik taraf API v1.

Selepas GitHub Pages selesai diterbitkan, muat semula laman dan buka semula PWA. Jika ikon pemasangan lama masih digunakan oleh peranti, nyahpasang pintasan PWA lama dan pasang semula daripada laman yang dikemas kini.

Sistem baharu berasaskan PDF **SKPM Kualiti@Sekolah — Bab 3 Instrumen** yang dibekalkan pengguna.

**Mula dengan memasang Apps Script v2. Frontend v2 tidak boleh menggunakan API v1.**

## Apa yang terkandung

| Bahagian | Kandungan |
| --- | --- |
| Kekuatan Kami | A1–A9; 22 medan sumber, prasarana dan sokongan |
| Pengurusan Kami | Standard 1, 2, 3.1, 3.2, 3.3 dan 4; 50 item, 216 tindakan dengan rubrik 0–4 |
| Pencapaian Kami | Standard 5, aspek 5.1–5.4; 11 item, 36 medan terperinci |

Katalog keseluruhan mempunyai 70 item. Data PBD/UASA boleh diulang mengikut konteks mata pelajaran atau kelas. Setiap tindakan rubrik mempunyai panduan bagi skor 4, 3, 2, 1 dan 0 serta nombor halaman PDF asal.

PDF sumber disertakan dalam assets/instrumen-sumber.pdf. Pemetaan lengkap dalam pemetaan-instrumen.json. Metadata PDF bertarikh 10 Ogos 2023; ia tidak dianggap bukti edisi rasmi 2026. Tahun penilaian sistem boleh dipilih mengikut keperluan.

## 1. Pasang Apps Script — cara paling mudah

1. Buka Google Sheet sekolah:
   https://docs.google.com/spreadsheets/d/1ln3kviRYg-hShqoNiUl-Q6OqzFrLGoi_nmz7Tbb7pV8/edit
2. Buka **Extensions → Apps Script**, dalam projek SK@S yang menggunakan URL /exec asal jika mahu mengekalkan URL tersebut.
3. Buka fail **APPSCRIPT_LENGKAP_COPY_PASTE.gs** daripada ZIP menggunakan editor teks.
4. Salin **semua kod** fail itu dan gantikan kandungan **Code.gs** dalam editor Apps Script. Fail gabungan sudah merangkumi katalog instrumen, enjin kiraan dan API.
5. Jika pernah memasang fail modular Instrumen.gs atau Scoring.gs dalam projek yang sama, kosongkan atau buang salinannya supaya kod tidak diisytiharkan dua kali. Jangan pasang fail gabungan dan fail modular serentak.
6. Pilih fungsi **setupSystem** di bahagian atas editor dan tekan **Run**.
7. Berikan kebenaran Google Sheets dan Google Drive apabila diminta. Akaun pemilik script perlu boleh menyunting Sheet dan menambah fail dalam folder Drive sekolah.
8. Buka **Execution log**. Jika akaun admin baharu dicipta, nama pengguna `admin` dan kata laluan sementara rawak akan dipaparkan.

**Jika menggunakan projek yang sama dengan v1:** akaun dan kata laluan lama dikekalkan. setupSystem memindahkan simpanan akaun kepada format v2 tanpa menetapkan semula kata laluan. Jika projek baharu digunakan, akaun baharu dicipta kerana Script Properties tidak dipindahkan antara projek.

**Pilihan modular untuk penyunting kod:** sebagai ganti fail gabungan, pasang ketiga-tiga fail **appscript/Instrumen.gs**, **appscript/Scoring.gs** dan **appscript/Code.gs** dalam projek yang sama. Gunakan satu kaedah pemasangan sahaja.

Manifest pilihan appscript/appsscript.json menetapkan zon masa Asia/Kuala_Lumpur dan skop Sheets/Drive. Untuk menyalinnya, buka Project Settings → Show appsscript.json manifest file in editor. Tanpa menyalin manifest, tetapkan zon masa projek kepada Kuala Lumpur dan benarkan pengesanan skop daripada kod.

## 2. Deploy Web App versi baharu

Untuk mengekalkan URL asal:

1. **Deploy → Manage deployments**.
2. Pilih deployment SK@S, tekan ikon pensel **Edit**.
3. Pada Version, pilih **New version**.
4. Tetapkan **Execute as: Me**.
5. Tetapkan **Who has access: Anyone**.
6. Tekan **Deploy**.

**Menekan Save dalam editor sahaja tidak mengemas kini versi /exec yang diterbitkan.**

Jika akaun sekolah mengehadkan pilihan Anyone atau kebenaran Sheets/Drive, pentadbir akaun sekolah perlu menyelesaikan sekatan tersebut. Fail frontend tidak boleh memintas sekatan akaun Google.

URL yang telah dimasukkan dalam config.js:
https://script.google.com/macros/s/AKfycbzZgVc3KC3bQiZmtGMoZfsZ3pFRl1hOwmMZfXxl6jxMc-jULol5XwrkOgjjVJZaDaDARw/exec

Jika mencipta deployment baharu, salin URL berakhir /exec dan gantikan **apiUrl** dalam config.js.

Buka URL /exec dalam pelayar. Respons yang betul perlu mengandungi:

```json
{"ok":true,"app":"SKAS","version":"2.0.0","instrumentVersion":"2.0.0","ready":true}
```

Respons sebenar turut mempunyai nama sekolah dan cap SHA-256 PDF sumber. Frontend menyemak versi serta cap sumber sebelum menghantar log masuk. Jika ready false, jalankan setupSystem dalam projek deployment yang sama. Jika masih versi 1.0.0, deployment belum dikemas kini.

## 3. Deploy fail laman ke GitHub Pages

1. Ekstrak ZIP.
2. Cipta repository baharu, contohnya **skas-sk-sungai-tiram-v2**, atau gantikan fail laman repository SK@S sedia ada.
3. Muat naik **kandungan folder** ke root repository. Jangan letakkan index.html satu aras di dalam folder tambahan.
4. Fail laman yang diperlukan:
   - index.html
   - styles.css
   - app.js
   - config.js
   - instrumen.js
   - scoring.js
   - sw.js
   - manifest.webmanifest
   - folder assets dengan semua kandungannya
   - .nojekyll jika tersedia
5. **Settings → Pages → Source: Deploy from a branch → main → /(root) → Save**.
6. Tunggu GitHub memaparkan URL HTTPS laman.
7. Buka URL itu, tekan **Uji Sambungan** dan log masuk.

Tiada pemasangan npm atau proses build diperlukan.

Pilihan GitHub Actions: workflow **.github/workflows/pages.yml** juga disediakan. Jika menggunakan workflow ini, muat naik folder .github dan pilih **Source: GitHub Actions**. Workflow menyalin fail laman sahaja ke _site.

Fail Apps Script dipasang dalam editor Google; GitHub Pages tidak menjalankan fail .gs.

## 4. Log masuk dan tetapkan pengguna

- Gunakan akaun admin sedia ada jika menaik taraf projek v1 yang sama.
- Bagi projek baharu, gunakan kata laluan sementara daripada Execution log dan tukar kepada kata laluan minimum 12 aksara apabila diminta.
- Buka **Tetapan Sistem → Pengguna** untuk menambah guru / PPS dan penyelaras.
- Penyelaras boleh diberi skop A, 1, 2, 3.1, 3.2, 3.3, 4 dan/atau 5.
- Guru / PPS melihat rekod yang dicipta sendiri atau ditugaskan kepada akaunnya.
- Penyelaras melihat dan menyemak rekod dalam skopnya, serta boleh membaca rekod milik/ditugaskan kepadanya.
- Pentadbir boleh mengurus semua rekod.

Jika terlupa kata laluan admin, jalankan **resetAdminPassword** dalam editor Apps Script. Nama pengguna dan kata laluan sementara baharu dipaparkan dalam Execution log. Fungsi ini tidak disediakan sebagai endpoint awam.

Kata laluan dan hash tidak diterbitkan melalui CSV atau fail frontend. Akaun disimpan secara berasingan dalam Script Properties. Sesi biasanya sehingga enam jam, tetapi boleh tamat lebih awal apabila cache pelayan luput. Menyahaktifkan pengguna atau menukar kata laluan membatalkan sesi lama.

## 5. Aliran penilaian

**Instrumen → Pilih Item → Mulakan Penilaian → Isi Konteks → Nilai Tindakan / Isi Metrik → Simpan Draf → Tambah Evidens → Hantar untuk Semakan → Disahkan / Perlu Pembetulan.**

Konteks membezakan rekod bagi sekolah, panitia, unit, guru, kelas atau sesi pencerapan. Contoh:

- 3.1.2.1: Panitia Sains.
- 3.2.2.1: Kelab STEM.
- 3.2.3.1: Pengakap.
- 4.1.1: Nama guru / Sains Tahun 3 / tarikh pencerapan.
- 5.1.1: Sains Tahun 3 — data agregat bagi mata pelajaran/kumpulan yang sama.

Fasa penilaian boleh dinamakan mengikut keperluan sekolah, contohnya Penilaian Kendiri atau Semakan Pertengahan. Dashboard dan laporan menapis mengikut tahun serta fasa. Fasa ialah medan pengurusan aplikasi, bukan ketetapan tambahan yang didakwa daripada PDF.

### Pemarkahan rubrik

- Pilih skor **0 hingga 4** bagi setiap tindakan berdasarkan panduan yang dipaparkan.
- **Kosong** bermaksud belum dinilai; ia tidak dianggap 0.
- **0** ialah skor sebenar dan dimasukkan dalam kiraan.
- **Tidak Berkaitan** digunakan pada item yang tidak terpakai dan mesti mempunyai sebab. Item itu tidak diberi skor sifar.
- Ringkasan item: jumlah skor ÷ bilangan tindakan yang telah dinilai. Draf separa dilabel sebagai separa.
- Penghantaran memerlukan semua tindakan lengkap atau item ditandakan Tidak Berkaitan dengan sebab.
- Dashboard dan analisis purata menggunakan tindakan dalam rekod rubrik yang **lengkap dan disahkan** sahaja; setiap tindakan diberi pemberat sama untuk ringkasan dalaman.
- **Tiada wajaran atau formula rasmi skor keseluruhan ditemui dalam PDF ini.** Oleh itu sistem tidak menjana atau mendakwa skor rasmi keseluruhan sekolah.

### Kekuatan dan pencapaian

- Nisbah dikira daripada pembilang ÷ pembahagi × 100.
- Pembahagi 0 menghasilkan **tidak dapat dikira**, bukan 0%. Untuk menghantar rekod, isi pembahagi yang sah atau tandakan medan Tidak Berkaitan dengan sebab.
- Nisbah kecukupan boleh melebihi 100%; sistem tidak mengehadkannya secara automatik.
- Nisbah bahagian kepada jumlah, seperti peranti berfungsi daripada jumlah peranti, tidak boleh mempunyai pembilang melebihi pembahagi.
- A2 menggunakan **Skor Rumusan Standard 4 tahun sebelumnya**.
- A8 boleh ditandakan Tidak Berkaitan jika sekolah tidak mempunyai asrama.
- GPS, PNGK, peratus dan bilangan dikekalkan mengikut unit asal; ia tidak dicampurkan menjadi satu skor.
- PBD berterusan dan UASA masing-masing mempunyai TP1–TP6. Gunakan satu konteks mata pelajaran/kumpulan bagi satu rekod. Jumlah setiap set kategori lengkap mestilah 100% dengan toleransi pembundaran 0.15%.
- Kategori sahsiah lengkap juga perlu berjumlah 100% dengan toleransi yang sama.
- Indikator sekolah menengah atau pendidikan khas boleh ditandakan Tidak Berkaitan mengikut keadaan sebenar sekolah.

## 6. Tugasan PPS

Pentadbir atau penyelaras boleh menetapkan **item, tahun, fasa, konteks, pegawai dan tarikh akhir**.

PPS memilih **Mulakan** pada tugasan. Rekod dipautkan kepada tugasan tersebut. Tahun, fasa, konteks dan akaun pegawai mesti sepadan; pelayan menghalang rekod kedua bagi tugasan yang sama. Tugasan yang sudah mempunyai rekod tidak boleh diubah atau dipadam supaya rujukan penilaian kekal jelas.

## 7. Evidens dan semakan

- Evidens boleh dipautkan kepada keseluruhan item atau tindakan/medan tertentu.
- Fail PDF, PNG, JPG, WEBP, Word, Excel dan PowerPoint disokong sehingga **5 MB** setiap fail.
- Folder Drive: **141CECiUmWTbz28f6BIzANZacehH9KriD**.
- Sistem tidak menjadikan fail Drive awam. Pastikan penyemak mempunyai akses melalui perkongsian Drive sekolah.
- Guru tidak boleh menyunting rekod yang telah dihantar atau disahkan. Penyemak boleh membuka semula rekod untuk pembetulan.
- Setiap semakan menyimpan nama penyemak, keputusan, maklum balas dan tarikh.
- Nombor revision menghalang perubahan lama menimpa suntingan pengguna lain.
- Memadam rekod atau membuang rujukan evidens mengekalkan fail asal di Drive.
- Jika permintaan simpan tamat masa menunggu, muat semula dan semak hasil sebelum mengulang simpanan. Permintaan tulis tidak diulang secara automatik.

## 8. Laporan, PDF dan CSV

Menu **Laporan & Analisis** menyediakan rumusan pengurusan, daftar penilaian, daftar evidens, laporan terperinci dan rekod belum lengkap. Gunakan penapis bidang, status, tajuk dan konteks.

Butang **Cetak / PDF** membuka dialog cetakan pelayar. Pilih **Save as PDF / Simpan sebagai PDF** untuk menyimpan. Laporan individu dan rumusan menggunakan A4 potret; jadual senarai menggunakan A4 landskap. Nyahaktifkan Headers and footers jika tidak mahu URL pelayar pada cetakan.

**Eksport CSV** memuat turun rekod mengikut penapis. Data metrik disertakan sebagai JSON supaya unit dan struktur medan tidak hilang.

## 9. PWA

Gunakan URL HTTPS GitHub Pages.

- Android / Chrome: menu ⋮ → Install app / Add to Home screen.
- iPhone / iPad / Safari: Kongsi → Add to Home Screen → Add.
- Komputer / Chrome atau Edge: ikon pemasangan pada bar alamat jika tersedia.

Kerangka aplikasi dan katalog rubrik dicache untuk pembukaan selepas lawatan dalam talian pertama. Log masuk, rekod, muat naik dan simpanan memerlukan Internet. Respons API dan rekod sekolah tidak dicache. Demonstrasi menggunakan data contoh dalam memori dan tidak menulis ke Google Sheets.

Jika menaik taraf daripada v1 dan paparan lama masih muncul, muat semula laman atau padam data laman/pasang semula PWA. Service worker v2 membersihkan cache kerangka SK@S versi terdahulu apabila aktif.

## 10. Data lama dan helaian baharu

Versi 2 menggunakan helaian **SKAS2_Instrumen, SKAS2_Rekod, SKAS2_Evidens, SKAS2_Semakan, SKAS2_Tugasan, SKAS2_Tetapan dan SKAS2_Log_Aktiviti**.

Helaian SKAS_ versi lama dan gid=0 tidak dipadam. Admin boleh melihat daftar lama melalui **Tetapan Sistem → Arkib V1**. Rekod lama tidak ditukar kod secara automatik kerana beberapa kod awal berbeza daripada instrumen sebenar.

Pembetulan penting:

| Struktur awal | Mengikut PDF sumber |
| --- | --- |
| Julat 3.1.2.1–3.1.2.4 satu kumpulan | Empat item berasingan: pelaksanaan MP; kualiti pengajaran guru; pencapaian murid; bantuan geran per kapita |
| 3.1.7 bagi peningkatan akademik | Gunakan 3.1.2.3; tiada item 3.1.7 dalam PDF ini |
| 3.2.3 sebagai Sukan untuk Semua | 3.2.3 ialah badan beruniform; Sukan untuk Semua ialah 3.2.6 |
| 3.3.7 sebagai PPDA | 3.3.7 ialah Pengurusan Pentadbiran Psikometrik |

Katalog adalah rujukan daripada PDF; ia tidak boleh diubah melalui tetapan pengguna biasa. Jangan ubah header Sheet atau ID tindakan secara manual. Fail instrumen frontend dan backend mesti menggunakan versi yang sama.

URL CSV asal dikekalkan dalam config.js sebagai rujukan, dan bukan sumber log masuk atau data penilaian. Jika Sheet diterbitkan ke web, hadkan penerbitan kepada helaian rujukan yang memang mahu dikongsi. Jangan terbitkan helaian penilaian sulit.

## 11. Penyelesaian masalah

| Mesej / masalah | Tindakan |
| --- | --- |
| Endpoint belum menggunakan instrumen v2 | Pasang fail gabungan, jalankan setupSystem, kemudian Deploy New version. |
| INSTRUMEN / SKAS_ENGINE is not defined | Kod yang dipasang tidak lengkap. Gunakan APPSCRIPT_LENGKAP_COPY_PASTE.gs, atau pasang ketiga-tiga fail modular. |
| Identifier already declared | Fail gabungan dan fail modular dipasang serentak. Kekalkan satu kaedah sahaja. |
| ready false / NOT_READY | setupSystem belum berjaya dalam projek deployment yang sama. |
| Tidak dapat menghubungi Apps Script | Semak Internet, URL /exec, akses Anyone dan Execute as Me. |
| Akses Drive gagal | Pastikan akaun pemilik script boleh menambah fail dalam folder Drive yang diberikan. |
| Rekod telah berubah | Muat semula data sebelum menyunting semula. |
| Rekod tidak muncul | Semak tahun, fasa, penapis, pemilik/penugasan dan skop akaun. |
| Kata laluan admin tidak muncul | Akaun lama dikekalkan. Gunakan kata laluan lama atau jalankan resetAdminPassword. |
| Data kategori tidak berjumlah 100% | Semak kategori TP1–TP6 atau sahsiah dalam konteks yang sama. |

## Pengujian dan had pengesahan

**72 ujian automatik setempat lulus:** 28 ujian API/akses/simpanan dengan simulasi Google, 24 ujian instrumen/pengiraan dan 20 ujian render UI. Katalog mempunyai rujukan lengkap bagi semua 216 tindakan dan lima tahap rubrik setiap tindakan.

Ujian pelayar sebenar dalam mod demo turut mengesahkan simpan draf, pemilihan skor 4/3/2/0 dengan purata 2.25, pemautan evidens, penghantaran dan pengesahan semakan, serta borang nisbah 20/25 = 80% pada paparan telefon 390 piksel. Dashboard dan butiran telefon tidak mempunyai limpahan mendatar dalam semakan tersebut.

Sambungan Google sebenar, kebenaran akaun, muat naik ke Drive sebenar dan pemasangan PWA pada peranti pengguna perlu disahkan selepas pemilik memasang/deploy kod. Tiada data sebenar ditulis ke akaun Google semasa pembangunan.

Font: Plus Jakarta Sans, SIL Open Font License — lihat assets/FONT-LICENSE.txt. Lencana menggunakan imej sekolah yang dibekalkan. Grafik antara muka dibina dengan CSS dan SVG.
