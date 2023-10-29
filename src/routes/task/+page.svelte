<script lang="ts">
  import TaskPage from "$lib/pages/TaskPage.svelte";
  import type IStorageProvider from "$lib/store/IStorageProvider";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let storageProvider: IStorageProvider;

  onMount(() => {
    if (browser)
      storageProvider = localStorage;
  });
</script>

{#if !!storageProvider}
  <TaskPage storageProvider={storageProvider} />
{/if}