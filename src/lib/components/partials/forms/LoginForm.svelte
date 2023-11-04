<script lang="ts">
  import TextBox from "$lib/components/inputs/TextBox.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import LoginService from "$lib/services/loginService";

  let username: string = "";
  let password: string = "";
  let errorMessage: string = null;

  async function onSubmit() {
    let loginService = new LoginService();

    await loginService.logIn(username, password);

    if (loginService.errorMessage) {
      errorMessage = loginService.errorMessage;
    } else
      window.location.href = "/task";
  }

  $: shouldBeDisabled = username === "" || password === "";
</script>

<form class="login-form" data-testid="login-form" on:submit={onSubmit}>
  <h2 class="login-form__title">Log In</h2>
  {#if !!errorMessage}
    <p class="login-form__error" data-testid="login-form__error">invalid username or password</p>
  {/if}
  <TextBox bind:value={username} id="login-form__username" label="Username" />
  <TextBox bind:value={password} id="login-form__password" label="Password" type="password" />
  <Button bind:disabled={shouldBeDisabled} testId="login-form__submit" size="small">Submit</Button>
</form>

<style>
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }

    .login-form__error {
        padding: 12px;
        background-color: var(--color-error-background);
        color: var(--color-error-font);
    }

    .login-form__title {
        font-size: var(--font-size-medium);
        font-weight: bold;
    }
</style>