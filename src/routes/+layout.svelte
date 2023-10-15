<main class="main-content">
  <slot />
</main>

<style global>
    @import "../style/reset.css";
    @import "../style/global.css";

    .main-content {
        --gutters-y: 32px;
        --gutters-x: 64px;

        min-height: calc(100vh - var(--gutters-y) * 2);
        background-color: var(--color-night);
        color: var(--color-font-light);
        padding: var(--gutters-y) var(--gutters-x);
        scroll-behavior: auto;
        display: flex;
        flex-direction: column;

        @media screen and (max-width: 700px) {
            --gutters-x: 16px;
        }

        @media screen and (max-width: 500px) {
            --gutters-x: 0;
        }
    }
</style>
