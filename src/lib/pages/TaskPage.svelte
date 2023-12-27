<script lang="ts">
  import TaskList from "$lib/components/tasks/TaskList.svelte";
  import RegularTaskList from "$lib/components/tasks/RegularTaskList.svelte";
</script>

<div class="task-page">
  <RegularTaskList />
  <TaskList />
</div>

<style>
    .task-page {
        display: flex;
        flex-direction: row;
        gap: 24px;
    }

    @media screen and (max-width: 800px) {
        .task-page {
            flex-direction: column-reverse;
        }
    }
</style>