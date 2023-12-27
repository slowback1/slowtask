<script lang="ts">
  import type { RegularTask } from "$lib/types";
  import Button from "$lib/components/ui/buttons/Button.svelte";

  export let task: RegularTask;
  export let onTaskOpen: () => void = () => {
  };

</script>

<div class="regular-task-item" data-testid="regular-task-item">
  <Button variant="text" onClick={onTaskOpen}>{task.taskName}</Button>
</div>

<style>
    .regular-task-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 1 1;
        width: 100%;
    }
</style>