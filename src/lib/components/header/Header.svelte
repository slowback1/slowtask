<script lang="ts">
  import HeaderRegisterForm from "$lib/components/header/HeaderRegisterForm.svelte";
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import LoginService from "$lib/services/loginService";
  import { onMount } from "svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import HeaderLoggedInArea from "$lib/components/header/HeaderLoggedInArea.svelte";
  import PlayerBar from "$lib/components/partials/player/PlayerBar.svelte";

  let isLoggedIn = !!MessageBus.getLastMessage(Messages.UserData);


  async function onRefresh() {
    let loginService = new LoginService();

    await loginService.syncUpdatedData();
  }

  function onLogOut() {
    let loginService = new LoginService();

    loginService.logOut();
  }

  onMount(() => {
    let unsubscribe = MessageBus.subscribe(Messages.UserData, value => isLoggedIn = !!value);

    return () => unsubscribe();
  });
</script>

<nav data-testid="header">

  <div class="header__content">
    <a class="skip-to-content" href="#content" data-testid="header__skip-content-link">
      Skip To Content
    </a>
    <a href="/" data-testid="header__home-link">Home</a>


    {#if !isLoggedIn}
      <HeaderRegisterForm />
    {:else}
      <HeaderLoggedInArea />
    {/if}
  </div>


</nav>
<PlayerBar />

<style>


    .header__content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0 var(--gutters-x);
        background-color: var(--color-sea);
        color: var(--color-font-light);
        height: calc(var(--header-height) - 24px);
    }

    .skip-to-content {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }

    .skip-to-content:focus {
        opacity: 1;
    }
</style>