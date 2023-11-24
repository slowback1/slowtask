<script lang="ts">
  import type { HTMLInputEvent, Task } from "$lib/types";
  import TextBox from "$lib/components/ui/inputs/TextBox.svelte";
  import SaveIcon from "$lib/components/ui/icons/SaveIcon.svelte";
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import DeleteIcon from "$lib/components/ui/icons/DeleteIcon.svelte";

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

<div class="task-item" data-testid="task-item">
  <TextBox id="task-item__input" type="text" bind:value={currentValue} onChange={onChange} />
  <Button size="small" onClick={onSave} testId="task-item__save">
    <SaveIcon />
  </Button>
  <Button size="small" variant="secondary" testId="task-item__delete" onClick={deleteTask}>
    <DeleteIcon />
  </Button>
  <input checked={task.isCompleted} type="checkbox" data-testid="task-item__complete" on:click={toggleCompletion} />
</div>

<style>
    .task-item {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    .task-item :global(.text-box) {
        flex-grow: 1;

        min-width: 100px;
    }

    .task-item :global(.icon) {
        width: var(--font-size-small);
        height: var(--font-size-small);
        fill: var(--color-lavender);
    }

    .task-item :global(.delete-icon) {
        fill: var(--color-rich-blue);
    }
</style>