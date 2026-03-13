<script>
  import { register, loginWithGoogle } from '$lib/auth.js';
  import { user } from '$lib/authStore.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = $state('');
  let password = $state('');
  let confirm = $state('');
  let error = $state('');
  let loading = $state(false);

  onMount(() => {
    const unsub = user.subscribe((u) => {
      if (u) goto('/');
    });
    return unsub;
  });

  async function handleRegister(e) {
    e.preventDefault();
    error = '';
    if (password !== confirm) {
      error = 'Password tidak cocok.';
      return;
    }
    if (password.length < 6) {
      error = 'Password minimal 6 karakter.';
      return;
    }
    loading = true;
    try {
      await register(email, password);
      goto('/');
    } catch (err) {
      error = getErrorMessage(err.code);
    } finally {
      loading = false;
    }
  }

  async function handleGoogle() {
    error = '';
    loading = true;
    try {
      await loginWithGoogle();
      goto('/');
    } catch (err) {
      error = getErrorMessage(err.code);
    } finally {
      loading = false;
    }
  }

  function getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email sudah terdaftar.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/weak-password': 'Password terlalu lemah.'
    };
    return messages[code] ?? 'Terjadi kesalahan. Coba lagi.';
  }
</script>

<nav class="navbar">
  <div class="navbar-brand">
    <span class="flag">🇻🇳</span>
    <span class="brand-text">Viet Vocab</span>
  </div>
</nav>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <h1 class="auth-title">Daftar</h1>
      <p class="auth-sub">Buat akun baru untuk mulai belajar!</p>
    </div>

    {#if error}
      <div class="auth-error">{error}</div>
    {/if}

    <form onsubmit={handleRegister}>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} placeholder="email@contoh.com" required />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} placeholder="Minimal 6 karakter" required />
      </div>
      <div class="field">
        <label for="confirm">Konfirmasi Password</label>
        <input id="confirm" type="password" bind:value={confirm} placeholder="Ulangi password" required />
      </div>
      <button type="submit" class="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Daftar'}
      </button>
    </form>

    <div class="auth-divider"><span>atau</span></div>

    <button class="btn btn-google btn-full" onclick={handleGoogle} disabled={loading}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
      Daftar dengan Google
    </button>

    <p class="auth-footer">
      Sudah punya akun? <a href="/login">Masuk</a>
    </p>
  </div>
</div>
