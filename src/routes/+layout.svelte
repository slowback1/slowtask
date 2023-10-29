<script lang="ts">
  import type IStorageProvider from "$lib/store/IStorageProvider";
  import Header from "$lib/components/header/Header.svelte";
  import { onMount } from "svelte";

  let storageProvider: IStorageProvider;

  onMount(() => {
    storageProvider = localStorage;
  });
</script>
<main>
  {#if (!!storageProvider)}
    <Header storageProvider={storageProvider} />
  {/if}
  <div id="content" class="main-content">
    <slot />
  </div>
</main>
<style global>
    @import "../style/reset.css";
    @import "../style/global.css";

    .main-content {
        min-height: calc(100vh - var(--gutters-y) * 2 - var(--header-height));
        background-color: var(--color-rich-blue);
        color: var(--color-font-light);
        padding: var(--gutters-y) var(--gutters-x);
        scroll-behavior: auto;
        display: flex;
        flex-direction: column;
    }
</style>
