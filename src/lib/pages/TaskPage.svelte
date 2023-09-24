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

  function deleteTask(taskId: string) {
    context.delete(taskId);
  }

  function toggleCompletion(taskId: string) {
    let task = tasks.find(t => t.taskId === taskId);
    task.isCompleted = !task.isCompleted;

    context.update(taskId, task);
  }
</script>


<div class="task-list" data-testid="task-list">
  {#each tasks as task}
    <TaskItem task={task} onUpdate={updateTask} onDelete={deleteTask} onToggleComplete={toggleCompletion} />
  {/each}
</div>

<button on:click={addTask} data-testid="add-task-button">
  Add Task
</button>
