<script>
  import LoginForm from "$lib/components/partials/forms/LoginForm.svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { onMount } from "svelte";
  import { Messages } from "$lib/bus/Messages";

  onMount(() => {
    MessageBus.subscribe(Messages.UserData, (value) => {
      if (!!value) window.location.href = "/task";
    });
  });
</script>

<div class="intro-page__wrapper">
  <div data-testid="intro-page" class="intro-page">
    <h1 class="intro-page__title">SlowTask</h1>
    <p class="intro-page__description">
      🚀 Level Up Your Life: Say goodbye to the monotony of your daily routine. With SlowTask, every task becomes a
      quest, and every goal is an achievement waiting to be unlocked.
    </p>

    <a class="intro-page__new-user-link" data-testid="intro-page__new-user-link" href="/task">Continue as a Guest</a>
    <hr />

    <LoginForm />
  </div>
</div>

<style>
    .intro-page {
        width: clamp(320px, 30%, 500px);
        background-color: var(--color-lavender);
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: var(--color-font-dark);
        padding: 16px;
    }

    .intro-page__new-user-link {
        color: var(--color-yale-blue-highlight);
        text-decoration: underline;
        text-decoration-color: var(--color-yale-blue-highlight);
    }

    .intro-page__title {
        font-family: var(--font-family-primary);
        font-size: var(--font-size-large);
        text-align: center;
        padding: 12px 4px;
    }

    .intro-page__description {
        font-family: var(--font-family-primary);
        font-size: var(--font-size-small);
        padding: 12px 0;
        opacity: 0.7;
    }

    .intro-page__wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>