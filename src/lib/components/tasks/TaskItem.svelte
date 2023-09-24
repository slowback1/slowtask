<script lang="ts">
  import type { HTMLInputEvent, Task } from "$lib/types";

  export let task: Task;
  export let onUpdate: (task: Task) => void;
  export let onDelete: (taskId: string) => void;
  export let onToggleComplete: (taskId: string) => void;

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

  function deleteTask() {
    onDelete(task.taskId);
  }

  function toggleCompletion() {
    onToggleComplete(task.taskId);
  }
</script>

<div data-testid="task-item">
  {#if isEditMode}
    <input use:initInput data-testid="task-item__input" bind:value={currentValue} on:change={onChange} />
    <button on:click={onSave} data-testid="task-item__save">Save</button>
    <button data-testid="task-item__delete" on:click={deleteTask}>Delete</button>
  {:else}
    <input checked={task.isCompleted} type="checkbox" data-testid="task-item__complete" on:click={toggleCompletion} />
    <button data-testid="task-item__toggle" on:click={toggleEditMode}>{task.name}</button>
  {/if}
</div>