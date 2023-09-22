<script lang="ts">
  import type { HTMLInputEvent, Task } from "$lib/types";

  export let task: Task;
  export let onUpdate: (task: Task) => void;
  let currentValue = task.name;


  let isEditMode = false;

  function onSave() {
    let updatedTask = { ...task, name: currentValue };

    onUpdate(updatedTask);

    isEditMode = false;
  }


  function onChange(event: HTMLInputEvent) {
    event.stopPropagation();

    currentValue = event.target.value;
  }

  function toggleEditMode() {
    isEditMode = !isEditMode;
  }

  function initInput(element: HTMLInputElement) {
    element.focus();
  }
</script>

<div data-testid="task-item">
  {#if isEditMode}
    <input use:initInput data-testid="task-item__input" bind:value={currentValue} on:change={onChange} />
    <button on:click={onSave} data-testid="task-item__save">Save</button>
  {:else}
    <button data-testid="task-item__toggle" on:click={toggleEditMode}>{task.name}</button>
  {/if}
</div>