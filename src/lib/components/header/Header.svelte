<script lang="ts">
  import type IStorageProvider from "$lib/store/IStorageProvider";
  import UserStore from "$lib/store/userStore";
  import HeaderRegisterForm from "$lib/components/header/HeaderRegisterForm.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import LoginService from "$lib/services/loginService";

  export let storageProvider: IStorageProvider;

  let userStore = new UserStore(storageProvider);

  let isLoggedIn = userStore.get() !== undefined;

  async function onRefresh() {
    let loginService = new LoginService(storageProvider);

    await loginService.syncUpdatedData();
  }
</script>

<nav data-testid="header">
  <a href="/" data-testid="header__home-link">Home</a>

  {#if !isLoggedIn}
    <HeaderRegisterForm storageProvider={storageProvider} />
  {:else}
    <Button size="small" onClick={onRefresh} testId="header__refresh-button">
      Refresh
    </Button>
  {/if}
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0 var(--gutters-x);
        height: var(--header-height);
        background-color: var(--color-sea);
        color: var(--color-font-light);
    }
</style>