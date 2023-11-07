<script lang="ts">
  import Header from "$lib/components/header/Header.svelte";
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import getRealStorageProvider from "$lib/store/realStorageProvider";
  import DataSyncingService from "$lib/services/dataSyncingService";


  onMount(() => {
    MessageBus.initialize(getRealStorageProvider());
    DataSyncingService.initialize();
  });
</script>
<main>
  <Header />
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
