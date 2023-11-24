<script lang="ts">
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import LoginService from "$lib/services/loginService";
  import TextBox from "$lib/components/ui/inputs/TextBox.svelte";


  let username: string = "";
  let password: string = "";

  async function onSubmit() {
    let loginService = new LoginService();

    await loginService.register(username, password);

    window.location.reload();
  }
</script>
<div class="header__register">
  <p class="header__register-label">
    Register to sync data between devices
  </p>
  <form class="header__register-form" on:submit={onSubmit} data-testid="header__register-form">
    <TextBox bind:value={username} label="Username" type="string" id="header__register-username" />
    <TextBox bind:value={password} label="Password" type="password" id="header__register-password" />
    <Button size="small" testId="header__register-submit" variant="primary">
      Register
    </Button>
  </form>
</div>

<style>
    .header__register {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
    }

    .header__register-form {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    .header__register-label {
        opacity: 0.7;
    }
</style>