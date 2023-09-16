<script lang="ts">
  import TaskContext from "$lib/context/TaskContext";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { Task } from "$lib/types";

  let tasks: Task[] = [];
  let context: TaskContext;

  if (browser)
    context = TaskContext.Create();

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
</script>

<button on:click={addTask}>
  Add Task
</button>

{#each tasks as task}
  <p>
    {task.name}
  </p>
{/each}

