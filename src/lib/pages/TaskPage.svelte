<script lang="ts">
  import TaskContext from "$lib/context/TaskContext";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { Task } from "$lib/types";
  import type IStorageProvider from "$lib/store/IStorageProvider";
  import TaskItem from "$lib/components/tasks/TaskItem.svelte";

  export let storageProvider: IStorageProvider;

  export let tasks: Task[] = [];
  let context: TaskContext;

  context = TaskContext.Create(storageProvider);

  onMount(() => {
    let unsubscribe = context.subscribe(t => tasks = t);

    return () => {
      unsubscribe();
    };
  });

  function addTask() {
    context.add({
      taskId: "",
      name: "test task",
      isCompleted: false,
      createdDate: new Date(),
      details: "test details"
    });
  }

  function updateTask(task: Task) {
    context.update(task.taskId, task);
  }
</script>


<div class="task-list" data-testid="task-list">
  {#each tasks as task}
    <TaskItem task={task} onUpdate={updateTask} />
  {/each}
</div>

<button on:click={addTask} data-testid="add-task-button">
  Add Task
</button>
