<script lang="ts">
  export let testId: string = "";
  type ButtonVariant = "primary" | "secondary" | "text";
  type ButtonSize = "small" | "medium" | "large";
  export let variant: ButtonVariant = "primary";
  export let size: ButtonSize = "medium";
  export let href: string = undefined;
  export let disabled: boolean = false;
  export let onClick: (event: Event) => void = () => {
  };

  function getClassList() {
    let classes = "button";
    let addClass = (cls) => classes += ` ${cls}`;

    if (variant === "secondary") addClass("button-secondary");
    if (variant === "primary") addClass("button-primary");
    if (variant === "text") addClass("button-text");
    if (size === "small") addClass("button-small");
    if (size === "large") addClass("button-large");

    return classes;
  }

  const props = { class: getClassList(), "data-testid": testId };

</script>

{#if href}
  <a
    {...props}
    {href}
  >
    <slot></slot>
  </a>
{:else}
  <button
    {...props}
    on:click={onClick}
    disabled="{disabled}"
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
        transition: background-color 0.5s ease-in-out;
    }

    .button:hover {
        cursor: pointer;
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
        border-color: var(--color-nyanza);
    }

    .button-primary:hover, .button-primary:focus {
        background-color: var(--color-yale-blue-highlight);
    }

    .button-secondary {
        background-color: transparent;
        color: var(--color-nyanza);
        border-color: var(--color-nyanza);
    }

    .button-secondary:hover, .button-secondary:focus {
        background-color: var(--color-nyanza);
        color: var(--color-rich-blue);
    }

    .button-text {
        background-color: transparent;
        color: var(--color-rich-blue);
        border-color: transparent;
    }

    .button-text:hover, .button-text:focus {
        background-color: var(--color-rich-blue);
        color: var(--color-font-light);
    }
</style>