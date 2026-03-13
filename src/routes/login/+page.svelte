<script>
  import { login, loginWithGoogle } from '$lib/auth.js';
  import { user } from '$lib/authStore.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  onMount(() => {
    const unsub = user.subscribe((u) => {
      if (u) goto('/');
    });
    return unsub;
  });

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      await login(email, password);
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
      'auth/user-not-found': 'Email tidak ditemukan.',
      'auth/wrong-password': 'Password salah.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/invalid-credential': 'Email atau password salah.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.'
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
      <h1 class="auth-title">Masuk</h1>
      <p class="auth-sub">Selamat datang kembali!</p>
    </div>

    {#if error}
      <div class="auth-error">{error}</div>
    {/if}

    <form onsubmit={handleLogin}>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} placeholder="email@contoh.com" required />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} placeholder="••••••••" required />
      </div>
      <button type="submit" class="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>

    <div class="auth-divider"><span>atau</span></div>

    <button class="btn btn-google btn-full" onclick={handleGoogle} disabled={loading}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
      Masuk dengan Google
    </button>

    <p class="auth-footer">
      Belum punya akun? <a href="/register">Daftar</a>
    </p>
  </div>
</div>
