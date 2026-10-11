
import { useState } from 'react';

const dataAwal = [
  {
    id: 1,
    tanggal: '2026-10-01',
    nama: 'Uang saku',
    kategori: 'Pemasukan',
    jenis: 'Pemasukan',
    jumlah: 3500000,
  },
  {
    id: 2,
    tanggal: '2026-10-03',
    nama: 'Belanja bulanan',
    kategori: 'Kebutuhan',
    jenis: 'Pengeluaran',
    jumlah: 1000000,
  },
];

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka);

const formatTanggal = (tanggal) =>
  new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

function App() {
  const [halaman, setHalaman] = useState('dashboard');
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [transaksi, setTransaksi] = useState(dataAwal);

  const [form, setForm] = useState({
    nama: '',
    jumlah: '',
    jenis: 'Pengeluaran',
    tanggal: new Date().toISOString().slice(0, 10),
    kategori: 'Kebutuhan',
  });

  const pemasukan = transaksi
    .filter((item) => item.jenis === 'Pemasukan')
    .reduce((total, item) => total + item.jumlah, 0);

  const pengeluaran = transaksi
    .filter((item) => item.jenis === 'Pengeluaran')
    .reduce((total, item) => total + item.jumlah, 0);

  const saldo = pemasukan - pengeluaran;

  const transaksiTerurut = [...transaksi].sort(
    (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id
  );

  const pindahHalaman = (tujuan) => {
    setHalaman(tujuan);
    setMenuTerbuka(false);
  };

  const simpanTransaksi = (event) => {
    event.preventDefault();

    const dataBaru = {
      id: Date.now(),
      nama: form.nama.trim(),
      jumlah: Number(form.jumlah),
      jenis: form.jenis,
      tanggal: form.tanggal,
      kategori: form.kategori,
    };

    setTransaksi((dataLama) => [dataBaru, ...dataLama]);

    setForm({
      nama: '',
      jumlah: '',
      jenis: 'Pengeluaran',
      tanggal: new Date().toISOString().slice(0, 10),
      kategori: 'Kebutuhan',
    });

    pindahHalaman('transaksi');
  };

  const informasiHalaman = {
    dashboard: {
      judul: 'Dashboard Keuangan',
      deskripsi: 'Pantau kondisi keuanganmu dengan mudah.',
    },
    transaksi: {
      judul: 'Daftar Transaksi',
      deskripsi: 'Lihat seluruh pemasukan dan pengeluaranmu.',
    },
    tambah: {
      judul: 'Tambah Transaksi',
      deskripsi: 'Catat transaksi baru agar keuangan tetap teratur.',
    },
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-inner">
          <a
            href="#dashboard"
            className="brand"
            onClick={(event) => {
              event.preventDefault();
              pindahHalaman('dashboard');
            }}
          >
            <span className="brand-icon">Rp</span>
            <span>MoneyMate</span>
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Buka menu navigasi"
            aria-expanded={menuTerbuka}
            onClick={() => setMenuTerbuka(!menuTerbuka)}
          >
            ☰
          </button>

          <nav className={`nav-links ${menuTerbuka ? 'open' : ''}`}>
            <button
              className={`nav-button ${halaman === 'dashboard' ? 'active' : ''}`}
              onClick={() => pindahHalaman('dashboard')}
            >
              ◫ Dashboard
            </button>

            <button
              className={`nav-button ${halaman === 'transaksi' ? 'active' : ''}`}
              onClick={() => pindahHalaman('transaksi')}
            >
              ↔ Transaksi
            </button>

            <button
              className={`nav-button ${halaman === 'tambah' ? 'active' : ''}`}
              onClick={() => pindahHalaman('tambah')}
            >
              ＋ Tambah Data
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="welcome-row">
          <div>
            <div className="eyebrow">KEUANGAN PRIBADI</div>
            <h1 className="page-title">
              {informasiHalaman[halaman].judul}
            </h1>
            <p className="page-subtitle">
              {informasiHalaman[halaman].deskripsi}
            </p>
          </div>

          {halaman !== 'tambah' && (
            <button
              className="primary-button"
              onClick={() => pindahHalaman('tambah')}
            >
              ＋ Catat Transaksi
            </button>
          )}
        </section>

        {halaman === 'dashboard' && (
          <>
            <section className="summary-grid">
              <article className="summary-card">
                <div className="summary-top">
                  <span className="summary-label">Total Saldo</span>
                  <span className="summary-icon icon-balance">◈</span>
                </div>
                <div className="summary-value">{formatRupiah(saldo)}</div>
                <div className="summary-note">
                  Sisa uang dari seluruh transaksi
                </div>
              </article>

              <article className="summary-card">
                <div className="summary-top">
                  <span className="summary-label">Total Pemasukan</span>
                  <span className="summary-icon icon-income">↗</span>
                </div>
                <div className="summary-value">
                  {formatRupiah(pemasukan)}
                </div>
                <div className="summary-note">
                  Semua uang yang diterima
                </div>
              </article>

              <article className="summary-card">
                <div className="summary-top">
                  <span className="summary-label">Total Pengeluaran</span>
                  <span className="summary-icon icon-expense">↘</span>
                </div>
                <div className="summary-value">
                  {formatRupiah(pengeluaran)}
                </div>
                <div className="summary-note">
                  Semua uang yang dikeluarkan
                </div>
              </article>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2 className="panel-title">Transaksi Terbaru</h2>
                  <p className="panel-description">
                    Ringkasan aktivitas keuanganmu
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() => pindahHalaman('transaksi')}
                >
                  Lihat semua →
                </button>
              </div>

              <TabelTransaksi
                transaksi={transaksiTerurut.slice(0, 5)}
              />
            </section>
          </>
        )}

        {halaman === 'transaksi' && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">Semua Transaksi</h2>
                <p className="panel-description">
                  Total {transaksi.length} transaksi tercatat
                </p>
              </div>
            </div>

            <TabelTransaksi transaksi={transaksiTerurut} />
          </section>
        )}

        {halaman === 'tambah' && (
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">Detail Transaksi</h2>
                <p className="panel-description">
                  Isi informasi transaksi di bawah ini.
                </p>
              </div>
            </div>

            <form onSubmit={simpanTransaksi}>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label className="form-label" htmlFor="nama">
                    Nama transaksi
                  </label>
                  <input
                    className="form-control-custom"
                    id="nama"
                    type="text"
                    placeholder="Contoh: Makan siang"
                    value={form.nama}
                    onChange={(event) =>
                      setForm({ ...form, nama: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="jumlah">
                    Nominal (Rp)
                  </label>
                  <input
                    className="form-control-custom"
                    id="jumlah"
                    type="number"
                    min="1"
                    placeholder="Contoh: 25000"
                    value={form.jumlah}
                    onChange={(event) =>
                      setForm({ ...form, jumlah: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="jenis">
                    Jenis transaksi
                  </label>
                  <select
                    className="form-control-custom"
                    id="jenis"
                    value={form.jenis}
                    onChange={(event) =>
                      setForm({ ...form, jenis: event.target.value })
                    }
                  >
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="tanggal">
                    Tanggal
                  </label>
                  <input
                    className="form-control-custom"
                    id="tanggal"
                    type="date"
                    value={form.tanggal}
                    onChange={(event) =>
                      setForm({ ...form, tanggal: event.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="kategori">
                    Kategori
                  </label>
                  <select
                    className="form-control-custom"
                    id="kategori"
                    value={form.kategori}
                    onChange={(event) =>
                      setForm({ ...form, kategori: event.target.value })
                    }
                  >
                    <option>Kebutuhan</option>
                    <option>Makanan</option>
                    <option>Transportasi</option>
                    <option>Hiburan</option>
                    <option>Gaji</option>
                    <option>Tabungan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Simpan Transaksi
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => pindahHalaman('dashboard')}
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <footer className="footer">
        © 2026 MoneyMate · Catat transaksi, atur keuangan dengan bijak 💚
      </footer>
    </div>
  );
}

function TabelTransaksi({ transaksi }) {
  if (transaksi.length === 0) {
    return <div className="empty-state">Belum ada transaksi.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Nama Transaksi</th>
            <th>Kategori</th>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Nominal</th>
          </tr>
        </thead>
        <tbody>
          {transaksi.map((item) => (
            <tr key={item.id}>
              <td className="transaction-name">{item.nama}</td>
              <td>
                <span className="category-pill">{item.kategori}</span>
              </td>
              <td>{formatTanggal(item.tanggal)}</td>
              <td>{item.jenis}</td>
              <td
                className={
                  item.jenis === 'Pemasukan'
                    ? 'amount-income'
                    : 'amount-expense'
                }
              >
                {item.jenis === 'Pemasukan' ? '+' : '−'}
                {formatRupiah(item.jumlah)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
