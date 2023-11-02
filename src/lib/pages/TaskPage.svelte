<script lang="ts">
  import { onMount } from "svelte";
  import type { Task } from "$lib/types";
  import TaskItem from "$lib/components/tasks/TaskItem.svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import TaskService from "$lib/services/taskService";


  let tasks: Task[] = MessageBus.getLastMessage(Messages.TaskData) ?? [];

  const taskService = new TaskService();


  onMount(() => {
    let unsubscribe = MessageBus.subscribe<Task[]>(Messages.TaskData, (value) => tasks = value ?? []);

    return () => {
      unsubscribe();
    };
  });

  function addTask() {
    taskService.add({
      taskId: "",
      name: "test task",
      isCompleted: false,
      createdDate: new Date(),
      details: "test details"
    });
  }

  function updateTask(task: Task) {
    taskService.update(task.taskId, task);
  }

  function deleteTask(taskId: string) {
    taskService.delete(taskId);
  }

  function toggleCompletion(taskId: string) {
    let task = tasks.find(t => t.taskId === taskId);
    task.isCompleted = !task.isCompleted;

    taskService.update(taskId, task);
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
