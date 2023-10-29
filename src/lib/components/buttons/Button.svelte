<script lang="ts">
  export let testId: string = "";
  type ButtonVariant = "primary" | "secondary";
  type ButtonSize = "small" | "medium" | "large";
  export let variant: ButtonVariant = "primary";
  export let size: ButtonSize = "medium";
  export let href: string = undefined;
  export let onClick: (event: Event) => void = () => {
  };

</script>

{#if href}
  <a
    href={href}
    class="button"
    class:button-secondary={variant === "secondary"}
    class:button-primary={variant === "primary"}
    class:button-small={size === "small"}
    class:button-large={size === "large"}
    data-testid={testId}
  >
    <slot></slot>
  </a>
{:else}
  <button
    class="button"
    class:button-secondary={variant === "secondary"}
    class:button-primary={variant === "primary"}
    class:button-small={size === "small"}
    class:button-large={size === "large"}
    data-testid={testId}
    on:click={onClick}
  >
    <slot />
  </button>
{/if}
<style>
    .button {
        border-radius: 4px;
        border: 1px solid;
        padding: 8px 16px;
        text-decoration: none;
        font-family: var(--font-family-primary);
        font-size: var(--font-size-medium);
    }

    .button-small {
        padding: 4px 8px;
        font-size: var(--font-size-small);
    }

    .button-large {
        padding: 12px 24px;
    }

    .button:disabled {
        opacity: 0.5;
    }

    .button-primary {
        background-color: var(--color-yale-blue);
        color: var(--color-nyanza);
        transition: background-color 0.5s ease-in-out;
        border-color: var(--color-nyanza);
    }

    .button-primary:hover {
        background-color: var(--color-yale-blue-highlight);
    }

    .button-secondary {
        background-color: transparent;
        color: var(--color-nyanza);
        border-color: var(--color-nyanza);
    }

    .button-secondary:hover {
        background-color: var(--color-nyanza);
        color: var(--color-rich-blue);
    }
</style>