document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://127.0.0.1:8000/api/pengaduan/';
    const container = document.getElementById('aduan-container');

    const token = localStorage.getItem('authToken');
    const PELAPOR_ID = 1; // 🔥 GANTI sesuai ID user / warga di DB

    if (!token) {
        alert('Token tidak ditemukan. Login dulu.');
        window.location.href = 'login.html';
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('aduanModal'));

    function showAlert(type, msg) {
        container.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    }

    async function loadAduan() {
        container.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border"></div>
            </div>
        `;
        try {
            const res = await fetch(apiUrl, {
                headers: { 'Authorization': 'Token ' + token }
            });
            if (!res.ok) throw new Error(res.status);

            const data = await res.json();
            const list = Array.isArray(data) ? data : data.results;

            if (!list || list.length === 0) {
                showAlert('info', 'Belum ada pengaduan');
                return;
            }

            container.innerHTML = '';
            list.forEach(a => {
                const card = document.createElement('div');
                card.className = 'card mb-3 shadow-sm';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="mb-1">${a.judul}</h5>
                        <p class="mb-2">${a.deskripsi}</p>
                        <small class="text-muted">
                            Status: ${a.status || 'BARU'}
                        </small>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (err) {
            console.error(err);
            showAlert('danger', 'Gagal memuat data pengaduan');
        }
    }

    document.getElementById('btn-tambah-aduan').addEventListener('click', () => {
        document.getElementById('aduan-form').reset();
        modal.show();
    });

    document.getElementById('btn-simpan-aduan').addEventListener('click', async () => {
        const judul = document.getElementById('aduan-judul').value.trim();
        const deskripsi = document.getElementById('aduan-deskripsi').value.trim();

        if (!judul || !deskripsi) {
            alert('Judul dan deskripsi wajib diisi');
            return;
        }

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token
                },
                body: JSON.stringify({
                    judul: judul,
                    deskripsi: deskripsi,
                    pelapor: PELAPOR_ID
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error(errData);
                alert('Gagal menyimpan pengaduan');
                return;
            }

            modal.hide();
            loadAduan();
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat menyimpan');
        }
    });

    loadAduan();
});
