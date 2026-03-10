<script>
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Viet Vocab 🇻🇳</title>
  <meta name="description" content="Kartu Kosakata Bahasa Vietnam dengan Firebase Realtime Database" />
</svelte:head>

{@render children()}
