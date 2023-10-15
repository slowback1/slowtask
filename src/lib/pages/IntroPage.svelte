<script>
  import Button from "$lib/components/buttons/Button.svelte";
</script>

<div class="intro-page__wrapper">
  <div data-testid="intro-page" class="intro-page">
    <h1 class="intro-page__title">SlowTask</h1>
    <p class="intro-page__description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
    </p>
    <div data-testid="intro-page__new-user" class="intro-page__new-user">
      <Button href="/task" testId="intro-page__new-user-button">
        New User
      </Button>
    </div>
  </div>
</div>

<style>
    .intro-page {
        width: clamp(320px, 30%, 500px);
        min-height: 80vh;
        background-color: var(--color-lavender);
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: var(--color-font-dark);
    }

    .intro-page__new-user {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 32px;
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
        padding: 12px;
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