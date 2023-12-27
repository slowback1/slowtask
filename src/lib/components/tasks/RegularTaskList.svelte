<script lang="ts">
  import type { RegularTask } from "$lib/types";
  import { RegularTaskScheduleType } from "$lib/types";
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import RegularTaskItem from "$lib/components/tasks/RegularTaskItem.svelte";
  import RegularTaskService from "$lib/services/regularTaskService";
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import { addDays } from "$lib/utils/dateUtils";

  let regularTasks: RegularTask[] = [];
  const regularTaskService = new RegularTaskService();

  onMount(() => {
    MessageBus.subscribe<RegularTask[]>(Messages.RegularTaskData, (data) => regularTasks = data || []);
  });

  function addTask() {
    regularTaskService.addRegularTask("", RegularTaskScheduleType.Weekly, addDays(new Date(), 1));
    let newTask = RegularTaskService.regularTasks[RegularTaskService.regularTasks.length - 1];
    regularTaskService.openRegularTask(newTask.id);
  }
</script>

<div class="regular-task-list" data-testid="regular-task-list">
  <h2 class="regular-task-list__title" data-testid="regular-task-list__title">Regular Tasks</h2>

  <div class="regular-task-list__list">
    {#each regularTasks as regularTask}
      <RegularTaskItem
        task={regularTask}
        onTaskOpen={() => regularTaskService.openRegularTask(regularTask.id)}
      />
    {/each}
  </div>
  <Button size="small" testId="new-regular-task-item" onClick={addTask}>
    New Regular Task
  </Button>
</div>

<style>
    .regular-task-list {
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

    .regular-task-list__title {
        font-size: var(--font-size-large);
        align-self: center;
    }

    .regular-task-list__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
</style>
