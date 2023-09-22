<script lang="ts">
  import type { Task } from "$lib/types";

  export let task: Task;

  let isEditMode = false;

  function toggleEditMode() {
    isEditMode = !isEditMode;
  }
</script>

<div data-testid="task-item">
  {#if isEditMode}
    <input data-testid="task-item__input" value={task.name} />
  {:else}
    <button data-testid="task-item__toggle" on:click={toggleEditMode}>{task.name}</button>
  {/if}
</div>