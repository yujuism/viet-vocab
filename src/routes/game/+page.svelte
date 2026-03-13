<script>
  import { onMount, onDestroy } from 'svelte';
  import { subscribeWords } from '$lib/vocab.js';
  import { user } from '$lib/authStore.js';
  import { logout } from '$lib/auth.js';
  import { goto } from '$app/navigation';

  let allWords = $state([]);
  let deck = $state([]);
  let current = $state(0);
  let flipped = $state(false);
  let finished = $state(false);
  let known = $state(0);
  let learning = $state(0);
  let unsubscribe;
  let currentUser = $state(null);

  async function handleLogout() {
    await logout();
    goto('/login');
  }

  onMount(() => {
    const unsub = user.subscribe((u) => (currentUser = u));
    unsubscribe = subscribeWords((data) => {
      allWords = data;
      if (deck.length === 0 && data.length > 0) shuffle(data);
    });
    return unsub;
  });
  onDestroy(() => unsubscribe?.());

  function shuffle(words) {
    deck = [...words].sort(() => Math.random() - 0.5);
    current = 0;
    flipped = false;
    finished = false;
    known = 0;
    learning = 0;
  }

  function flip() {
    flipped = !flipped;
  }

  function next(result) {
    if (result === 'known') known++;
    else learning++;

    flipped = false;

    setTimeout(() => {
      if (current + 1 >= deck.length) {
        finished = true;
      } else {
        current++;
      }
    }, 200);
  }

  function restart() {
    shuffle(allWords);
  }

  let progress = $derived(deck.length > 0 ? Math.round((current / deck.length) * 100) : 0);
  let card = $derived(deck[current]);
</script>

<!-- Navbar -->
<nav class="navbar">
  <div class="navbar-brand">
    <span class="flag">🇻🇳</span>
    <span class="brand-text">Viet Vocab</span>
  </div>
  <div class="navbar-links">
    <a href="/" class="nav-link">📚 Kosakata</a>
    <a href="/game" class="nav-link active">🎴 Flashcard</a>
    {#if currentUser}
      <span class="nav-user">{currentUser.displayName ?? currentUser.email}</span>
      <button class="nav-link btn-logout" onclick={handleLogout}>Keluar</button>
    {:else}
      <a href="/login" class="nav-link">Masuk</a>
    {/if}
  </div>
</nav>

<main class="game-container">

  {#if allWords.length === 0}
    <!-- Empty state -->
    <div class="game-empty">
      <div class="empty-icon">📭</div>
      <p>Belum ada kosakata.</p>
      <a href="/" class="btn btn-primary mt-3">Tambah Kata Dulu</a>
    </div>

  {:else if finished}
    <!-- Result screen -->
    <div class="result-card">
      <div class="result-title">🎉 Selesai!</div>
      <div class="result-stats">
        <div class="stat stat-known">
          <span class="stat-num">{known}</span>
          <span class="stat-label">Hafal ✅</span>
        </div>
        <div class="stat stat-learning">
          <span class="stat-num">{learning}</span>
          <span class="stat-label">Perlu Belajar 🔄</span>
        </div>
      </div>
      <div class="result-score">
        Skor: {deck.length > 0 ? Math.round((known / deck.length) * 100) : 0}%
      </div>
      <button class="btn btn-primary mt-3" onclick={restart}>🔀 Ulangi</button>
    </div>

  {:else if card}
    <!-- Progress bar -->
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
      </div>
      <span class="progress-label">{current + 1} / {deck.length}</span>
    </div>

    <!-- Flip Card -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="scene" onclick={flip}>
      <div class="card-3d {flipped ? 'is-flipped' : ''}">

        <!-- Front: Vietnamese word -->
        <div class="card-face card-front">
          <div class="card-hint">Klik untuk melihat arti</div>
          <div class="card-word">{card.kata}</div>
          {#if card.pelafalan}
            <div class="card-pelafalan">/{card.pelafalan}/</div>
          {/if}
          <span class="card-badge">{card.kategori}</span>
        </div>

        <!-- Back: Indonesian meaning -->
        <div class="card-face card-back">
          <div class="card-hint">Arti</div>
          <div class="card-word">{card.arti}</div>
          {#if card.contoh}
            <div class="card-contoh">"{card.contoh}"</div>
          {/if}
        </div>

      </div>
    </div>

    <!-- Action buttons (only visible when flipped) -->
    {#if flipped}
      <div class="action-btns">
        <button class="btn btn-learning" onclick={() => next('learning')}>
          🔄 Perlu Belajar
        </button>
        <button class="btn btn-known" onclick={() => next('known')}>
          ✅ Hafal!
        </button>
      </div>
    {:else}
      <p class="flip-hint">👆 Klik kartu untuk membalik</p>
    {/if}

    <!-- Skip -->
    <button class="btn-skip" onclick={() => next('learning')}>Lewati →</button>
  {/if}

</main>
