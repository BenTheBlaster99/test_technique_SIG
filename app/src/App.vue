<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="brand-kicker">Frontend technical test</p>
        <h1>Candidate Management</h1>
      </div>

      <p class="brand-copy">
        Vue 3 dashboard connected to the provided JSON Server API.
      </p>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  min-height: 100vh;
  background: var(--app-background);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  padding: 2rem clamp(1.25rem, 4vw, 3rem) 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand-kicker {
  margin: 0 0 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-color);
}

.app-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.brand-copy {
  margin: 0;
  max-width: 28rem;
  color: var(--muted-color);
  text-align: right;
}

.app-content {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 3rem;
}

@media (max-width: 720px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-copy {
    text-align: left;
  }

  .app-content {
    width: min(1180px, calc(100% - 1.25rem));
    padding-top: 1.25rem;
  }
}
</style>
