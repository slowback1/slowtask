<script lang="ts">
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import type { PlayerData } from "$lib/types";
  import { Messages } from "$lib/bus/Messages";

  let currentExperience = 0;

  onMount(() => {
    let unsubscribe = MessageBus.subscribe<PlayerData>(Messages.PlayerData, value => currentExperience = value?.experience?.currentExperience ?? 0);

    return () => unsubscribe();
  });

</script>

<span data-testid="current-experience__announcer" class="screen-reader-only" aria-live="polite">
  Current Player Experience: {currentExperience}
</span>
<div class="current-experience">

  <label for="experience-bar">Experience</label>
  <meter
    role="meter"
    min="0"
    max="100"
    id="experience-bar"
    data-testid="experience-bar"
    value={currentExperience}
    aria-valuenow={currentExperience}
    title={`${currentExperience}exp`}
  ></meter>

</div>

<style>
    .current-experience {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
</style>