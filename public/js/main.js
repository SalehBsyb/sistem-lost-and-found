// Main client-side scripts
document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss bootstrap alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach((alert) => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    }, 5000);
  });

  // Character counter for secret characteristic input (min 30 chars)
  const ciriInput = document.getElementById('ciri_rahasia');
  const ciriCounter = document.getElementById('ciri_rahasia_count');
  if (ciriInput && ciriCounter) {
    const updateCount = () => {
      const len = ciriInput.value.trim().length;
      ciriCounter.textContent = `${len} / 30 karakter minimal`;
      if (len >= 30) {
        ciriCounter.classList.remove('text-danger');
        ciriCounter.classList.add('text-success');
      } else {
        ciriCounter.classList.remove('text-success');
        ciriCounter.classList.add('text-danger');
      }
    };
    ciriInput.addEventListener('input', updateCount);
    updateCount();
  }

  // Reject modal handler for claim verification
  const rejectModal = document.getElementById('rejectClaimModal');
  if (rejectModal) {
    rejectModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const claimId = button.getAttribute('data-claim-id');
      const actionForm = rejectModal.querySelector('#rejectClaimForm');
      if (actionForm && claimId) {
        actionForm.action = `/verifikasi/${claimId}/tolak`;
      }
    });
  }

  // Delete modal handler for category management
  const deleteKategoriModal = document.getElementById('deleteKategoriModal');
  if (deleteKategoriModal) {
    deleteKategoriModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const nama = button.getAttribute('data-nama');
      const modalNama = deleteKategoriModal.querySelector('#modalKategoriNama');
      const form = deleteKategoriModal.querySelector('#formDeleteKategori');
      if (modalNama) modalNama.textContent = nama;
      if (form) form.action = `/kategori/${id}/delete`;
    });
  }

  // Edit modal handler for category management
  const editKategoriModal = document.getElementById('editKategoriModal');
  if (editKategoriModal) {
    editKategoriModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const nama = button.getAttribute('data-nama');
      const form = editKategoriModal.querySelector('#formEditKategori');
      const input = editKategoriModal.querySelector('#edit_nama_kategori');
      if (input) input.value = nama;
      if (form) form.action = `/kategori/${id}/edit`;
    });
  }
});
