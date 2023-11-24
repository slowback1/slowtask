<script lang="ts">
  import { onMount } from "svelte";
  import type { Task } from "$lib/types";
  import TaskItem from "$lib/components/tasks/TaskItem.svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import TaskService from "$lib/services/taskService";
  import Button from "$lib/components/buttons/Button.svelte";
  import PlayerDataService from "$lib/services/playerDataService";


  let tasks: Task[] = MessageBus.getLastMessage(Messages.TaskData) ?? [];

  const taskService = new TaskService();
  const playerDataService = new PlayerDataService();


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

    if (task.isCompleted)
      playerDataService.addExperience(1);

    taskService.update(taskId, task);
  }
</script>

<div class="tasks">
  <h2 class="tasks__title">Tasks</h2>

  <div class="tasks__list" data-testid="task-list">
    {#each tasks as task}
      <TaskItem task={task} onUpdate={updateTask} onDelete={deleteTask} onToggleComplete={toggleCompletion} />
    {/each}
  </div>

  <Button size="small" onClick={addTask} testId="add-task-button">
    Add Task
  </Button>
</div>

<style>
    .tasks {
        margin: 0 auto;
        padding: 4px 12px;
        display: flex;
        flex-direction: column;
        width: clamp(280px, 33vw, 750px);
        background-color: var(--color-lavender);
        color: var(--color-font-dark);
        min-height: 80vh;
        border-radius: 12px;
        gap: 12px;
    }

    .tasks__title {
        font-size: var(--font-size-large);
        align-self: center;
    }

    .tasks__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
</style>