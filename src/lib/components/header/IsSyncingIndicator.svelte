<script lang="ts">
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";

  let isSyncing = false;

  const unsubscribe = MessageBus.subscribe(Messages.DataIsSyncing, value => {
    isSyncing = value ?? false;
  });

  onMount(() => {

    return unsubscribe;
  });

</script>

<div data-is-syncing={isSyncing ? "true" : "false"} data-testid="is-syncing-indicator">
  {isSyncing ? "Syncing..." : "Sync Complete!"}
</div>