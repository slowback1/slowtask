<script lang="ts">
  import { slugify } from "$lib/utils/stringUtils";

  export let type = "text";
  export let label = "";
  export let onChange = (event: Event) => {
  };
  export let id = slugify(label);
  export let value = "";
</script>

<label for={id}>
  {label}
</label>
<input data-testid={id} {type} {value} on:change={onChange} {id} />