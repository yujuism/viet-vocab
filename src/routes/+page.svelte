<script>
  import { onMount, onDestroy } from 'svelte';
  import { addWord, subscribeWords, updateWord, deleteWord } from '$lib/vocab.js';

  // ── State ──────────────────────────────────────────────
  let words = $state([]);
  let search = $state('');
  let filterKat = $state('');
  let toast = $state({ show: false, msg: '', type: 'success' });
  let unsubscribe;

  // Add form
  let form = $state({ kata: '', arti: '', pelafalan: '', contoh: '', kategori: '' });

  // Edit modal
  let editModal = $state(false);
  let editData = $state({ id: '', kata: '', arti: '', pelafalan: '', contoh: '', kategori: '' });

  // Pagination
  const PAGE_SIZE = 8;
  let currentPage = $state(1);

  // ── Lifecycle ──────────────────────────────────────────
  onMount(() => {
    unsubscribe = subscribeWords((data) => {
      words = data;
      currentPage = 1; // reset to page 1 on data change
    });
  });
  onDestroy(() => unsubscribe?.());

  // ── Computed ───────────────────────────────────────────
  let filtered = $derived(
    words.filter((w) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || w.kata.toLowerCase().includes(q) || w.arti.toLowerCase().includes(q);
      const matchKat = !filterKat || w.kategori === filterKat;
      return matchSearch && matchKat;
    })
  );

  let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  let paginated = $derived(
    filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  );

  // Reset to page 1 when search/filter changes
  $effect(() => {
    search; filterKat;
    currentPage = 1;
  });

  // ── Helpers ────────────────────────────────────────────
  const CATEGORIES = ['Salam', 'Angka', 'Warna', 'Makanan', 'Tempat', 'Umum'];

  const katBadge = {
    Salam: 'badge-salam',
    Angka: 'badge-angka',
    Warna: 'badge-warna',
    Makanan: 'badge-makanan',
    Tempat: 'badge-tempat',
    Umum: 'badge-umum'
  };

  function showToast(msg, type = 'success') {
    toast = { show: true, msg, type };
    setTimeout(() => (toast = { ...toast, show: false }), 2800);
  }

  function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
    return pages;
  }

  // ── CRUD Handlers ──────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    if (!form.kata || !form.arti || !form.kategori) return;
    await addWord({ ...form });
    form = { kata: '', arti: '', pelafalan: '', contoh: '', kategori: '' };
    showToast('✅ Kata berhasil ditambahkan!');
  }

  function openEdit(word) {
    editData = { ...word };
    editModal = true;
  }

  async function handleUpdate(e) {
    e.preventDefault();
    await updateWord(editData.id, editData);
    editModal = false;
    showToast('✏️ Kata berhasil diperbarui!');
  }

  async function handleDelete(id, kata) {
    if (!confirm(`Hapus kata "${kata}"?`)) return;
    await deleteWord(id);
    showToast('🗑️ Kata berhasil dihapus!', 'danger');
  }
</script>

<!-- ── Navbar ─────────────────────────────────────────── -->
<nav class="navbar">
  <div class="navbar-brand">
    <span class="flag">🇻🇳</span>
    <span class="brand-text">Viet Vocab</span>
  </div>
  <div class="navbar-links">
    <a href="/" class="nav-link active">📚 Kosakata</a>
    <a href="/game" class="nav-link">🎴 Flashcard</a>
  </div>
</nav>

<main class="container">

  <!-- ── Add Form ────────────────────────────────────── -->
  <section class="card mb-4">
    <div class="card-header">
      <span>＋ Tambah Kosakata Baru</span>
    </div>
    <div class="card-body">
      <form onsubmit={handleAdd}>
        <div class="form-grid">
          <div class="field">
            <label for="kata">Kata (Vietnam) <span class="req">*</span></label>
            <input id="kata" bind:value={form.kata} placeholder="e.g. xin chào" required />
          </div>
          <div class="field">
            <label for="arti">Arti (Indonesia) <span class="req">*</span></label>
            <input id="arti" bind:value={form.arti} placeholder="e.g. halo" required />
          </div>
          <div class="field">
            <label for="pelafalan">Pelafalan</label>
            <input id="pelafalan" bind:value={form.pelafalan} placeholder="e.g. sin ciao" />
          </div>
          <div class="field field-wide">
            <label for="contoh">Contoh Kalimat</label>
            <input id="contoh" bind:value={form.contoh} placeholder="e.g. Xin chào, tôi là Nam." />
          </div>
          <div class="field">
            <label for="kategori">Kategori <span class="req">*</span></label>
            <select id="kategori" bind:value={form.kategori} required>
              <option value="">-- Pilih --</option>
              {#each CATEGORIES as k}
                <option value={k}>{k}</option>
              {/each}
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-3">＋ Tambah Kata</button>
      </form>
    </div>
  </section>

  <!-- ── Filter & Search ────────────────────────────── -->
  <div class="toolbar mb-3">
    <input
      class="search-input"
      bind:value={search}
      placeholder="🔍 Cari kata atau arti..."
    />
    <select class="filter-select" bind:value={filterKat}>
      <option value="">Semua Kategori</option>
      {#each CATEGORIES as k}
        <option value={k}>{k}</option>
      {/each}
    </select>
    <span class="count">{filtered.length} kata</span>
  </div>

  <!-- ── Word Cards ──────────────────────────────────── -->
  {#if filtered.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📖</div>
      <p>Belum ada kosakata. Tambahkan kata pertamamu!</p>
    </div>
  {:else}
    <div class="word-grid">
      {#each paginated as word (word.id)}
        <div class="word-card">
          <div class="word-card-top">
            <span class="kata-viet">{word.kata}</span>
            <span class="badge {katBadge[word.kategori] ?? 'badge-umum'}">{word.kategori}</span>
          </div>
          <div class="kata-arti">{word.arti}</div>
          {#if word.pelafalan}
            <div class="pelafalan">/{word.pelafalan}/</div>
          {/if}
          {#if word.contoh}
            <div class="contoh">"{word.contoh}"</div>
          {/if}
          <div class="card-actions">
            <button class="btn btn-edit" onclick={() => openEdit(word)}>✏️ Edit</button>
            <button class="btn btn-delete" onclick={() => handleDelete(word.id, word.kata)}>🗑️ Hapus</button>
          </div>
        </div>
      {/each}
    </div>

    <!-- ── Pagination ──────────────────────────────── -->
    {#if totalPages > 1}
      <div class="pagination">
        <button
          class="page-btn"
          disabled={currentPage === 1}
          onclick={() => (currentPage = 1)}
          aria-label="Halaman pertama"
        >«</button>
        <button
          class="page-btn"
          disabled={currentPage === 1}
          onclick={() => currentPage--}
          aria-label="Sebelumnya"
        >‹</button>

        {#each getPageNumbers(currentPage, totalPages) as p}
          {#if p === '...'}
            <span class="page-ellipsis">…</span>
          {:else}
            <button
              class="page-btn {currentPage === p ? 'page-active' : ''}"
              onclick={() => (currentPage = p)}
            >{p}</button>
          {/if}
        {/each}

        <button
          class="page-btn"
          disabled={currentPage === totalPages}
          onclick={() => currentPage++}
          aria-label="Berikutnya"
        >›</button>
        <button
          class="page-btn"
          disabled={currentPage === totalPages}
          onclick={() => (currentPage = totalPages)}
          aria-label="Halaman terakhir"
        >»</button>
      </div>
      <div class="page-info">
        Halaman {currentPage} dari {totalPages} · Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} kata
      </div>
    {/if}
  {/if}
</main>

<!-- ── Edit Modal ──────────────────────────────────────── -->
{#if editModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={() => (editModal = false)}>
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
      <div class="modal-header">
        <span>✏️ Edit Kosakata</span>
        <button class="modal-close" onclick={() => (editModal = false)}>✕</button>
      </div>
      <form class="modal-body" onsubmit={handleUpdate}>
        <div class="form-grid">
          <div class="field">
            <label for="e-kata">Kata (Vietnam) <span class="req">*</span></label>
            <input id="e-kata" bind:value={editData.kata} required />
          </div>
          <div class="field">
            <label for="e-arti">Arti (Indonesia) <span class="req">*</span></label>
            <input id="e-arti" bind:value={editData.arti} required />
          </div>
          <div class="field">
            <label for="e-pelafalan">Pelafalan</label>
            <input id="e-pelafalan" bind:value={editData.pelafalan} />
          </div>
          <div class="field field-wide">
            <label for="e-contoh">Contoh Kalimat</label>
            <input id="e-contoh" bind:value={editData.contoh} />
          </div>
          <div class="field">
            <label for="e-kategori">Kategori <span class="req">*</span></label>
            <select id="e-kategori" bind:value={editData.kategori} required>
              {#each CATEGORIES as k}
                <option value={k}>{k}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick={() => (editModal = false)}>Batal</button>
          <button type="submit" class="btn btn-primary">💾 Simpan</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- ── Toast ───────────────────────────────────────────── -->
{#if toast.show}
  <div class="toast toast-{toast.type}">
    {toast.msg}
  </div>
{/if}
