<script lang="ts">
  import LoginService from "$lib/services/loginService";
  import Button from "$lib/components/ui/buttons/Button.svelte";
  import MessageBus from "$lib/bus/MessageBus";
  import { Messages } from "$lib/bus/Messages";
  import IsSyncingIndicator from "$lib/components/header/IsSyncingIndicator.svelte";

  async function onRefresh() {
    let loginService = new LoginService();

    await loginService.syncUpdatedData();
  }

  function onLogOut() {
    let loginService = new LoginService();

    loginService.logOut();
  }
</script>
<div class="header__logged-in-area">
  <IsSyncingIndicator />

  <Button size="small" onClick={onRefresh} testId="header__refresh-button">
    Refresh
  </Button>
  <Button variant="secondary" size="small" onClick={onLogOut} testId="header__log-out-button">
    Log Out
  </Button>
</div>

<style>
    .header__logged-in-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 12px;
        align-items: center;
    }
</style>
