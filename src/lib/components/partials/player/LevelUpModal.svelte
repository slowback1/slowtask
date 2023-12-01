<script lang="ts">
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import type { PlayerData, PlayerStats } from "$lib/types";
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import PlayerDataService from "$lib/services/playerDataService";

  let previousNumberOfPoints = 0;
  let ref: HTMLDialogElement;

  function openDialog() {
    ref.showModal ? ref.showModal() : ref.open = true;
  }

  function closeDialog() {
    ref.close ? ref.close() : ref.open = false;
  }

  onMount(() => {
    let unsubscribe = MessageBus.subscribe<PlayerData>(Messages.PlayerData, (value) => {
      if (value) {
        let pointsToSpend = value.experience?.pointsToSpend ?? 0;
        let shouldLevelUp = pointsToSpend == previousNumberOfPoints + 1;

        if (ref && shouldLevelUp) {
          openDialog();

        }
        previousNumberOfPoints = pointsToSpend;
      }
    });

    return () => unsubscribe();
  });

  const onRaiseStat = (stat: keyof PlayerStats) => {
    let service = new PlayerDataService();
    service.spendPoint(stat);

    closeDialog();
  };

</script>

<dialog class="level-up" data-testid="level-up" bind:this={ref}>
  <p class="level-up__description">Level up! Raise one of your stats below</p>

  <div class="level-up__stats">
    <Button onClick={() => onRaiseStat("health")} testId="level-up__raise-health">Health</Button>
    <Button onClick={() => onRaiseStat("attack")} testId="level-up__raise-attack">Attack</Button>
    <Button onClick={() => onRaiseStat("searching")} testId="level-up__raise-searching">Searching</Button>
    <Button onClick={() => onRaiseStat("healing")} testId="level-up__raise-healing">Healing</Button>
    <Button onClick={() => onRaiseStat("defense")} testId="level-up__raise-defense">Defense</Button>
    <Button onClick={() => onRaiseStat("gathering")} testId="level-up__raise-gathering">Gathering</Button>
  </div>

  <div class="level-up__footer">
    <Button variant="text" onClick={closeDialog} testId="level-up__close">Close without Leveling Up
    </Button>
  </div>
</dialog>

<style>
    .level-up[open] {
        margin: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 24px;
    }

    .level-up::backdrop {
        background-color: #111;
        opacity: 0.4;
    }

    .level-up__description {
        font-weight: bold;
    }

    .level-up__stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
</style>