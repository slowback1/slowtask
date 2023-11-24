<script lang="ts">
  import PlayerExperienceIndicator from "$lib/components/partials/player/PlayerExperienceIndicator.svelte";
</script>

<div class="player-bar" role="menubar">
  <PlayerExperienceIndicator />
</div>

<style>
    .player-bar {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 0 var(--gutters-x);
        align-items: center;
        background-color: var(--color-brunswick);
        color: var(--color-font-light);
        height: 24px;
    }
</style>