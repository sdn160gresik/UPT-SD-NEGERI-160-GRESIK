# Monopoli Nusantara — Web Game

Prototype game edukasi berbasis web menggunakan aset gambar yang diberikan.

## Cara menjalankan

Paling mudah:
1. Ekstrak ZIP.
2. Buka `index.html` di Chrome/Edge.

Jika browser memblokir aset lokal, jalankan server lokal dari folder ini:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Fitur
- 2–6 pemain pada satu perangkat (pass-and-play).
- Dua dadu dan animasi perpindahan token.
- 20+ petak budaya Indonesia.
- Beli properti dan bayar sewa otomatis.
- Kartu Keberuntungan memakai aset gambar yang diberikan.
- Dana Budaya berisi 12 kuis matematika dari aset gambar.
- GO +M200, dadu kembar = giliran tambahan.
- Ayo Berkunjung memindahkan pemain ke Toraja.
- Pemain bangkrut jika saldo negatif.
- Batas ronde 10/15/20/30 dan ranking nilai akhir.
- Autosave via localStorage.
- Responsive untuk desktop/tablet/mobile.

## Catatan multiplayer
Versi ini adalah multiplayer lokal pada satu browser. Untuk 2–6 orang bermain dari perangkat berbeda secara real-time, dibutuhkan backend/room sync (misalnya Firebase/Supabase/Socket.IO).
