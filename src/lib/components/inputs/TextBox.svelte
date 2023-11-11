<script lang="ts">
  import { slugify } from "$lib/utils/stringUtils";

  export let type = "text";
  export let label = "";
  export let onChange = (event: Event) => {
  };
  export let id = slugify(label);
  export let value = "";
  let boundValue = "";

  $: updateBound(value);

  function updateBound(newValue: string) {
    boundValue = newValue;
  }

  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value;

  };

</script>
<label class="text-box__label" data-testid={id + "-label"} for={id}>
  {label}
</label>
<input class="text-box" data-testid={id} {type} value={boundValue} on:input={handleInput} on:change={onChange} {id} />

<style>
    .text-box {
        padding: 4px;
        background-color: transparent;
        border: 1px solid var(--color-rich-blue);
        border-radius: 4px;
    }
</style>