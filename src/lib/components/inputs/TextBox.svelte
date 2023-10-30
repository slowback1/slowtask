<script lang="ts">
  import { slugify } from "$lib/utils/stringUtils";

  export let type = "text";
  export let label = "";
  export let onChange = (event: Event) => {
  };
  export let id = slugify(label);
  export let value = "";

  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value;

  };

</script>

<label for={id}>
  {label}
</label>
<input data-testid={id} {type} value={value} on:input={handleInput} on:change={onChange} {id} />