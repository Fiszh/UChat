<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Input from "$components/Inputs/Input.svelte";

    type Props = {
        name: string;
        onChange: (value: string) => void;
        description?: string;
        value: string | number;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let { name, onChange, description, value }: Props = $props();
</script>

<SettingsWrapper {name} {description}>
    <Input onChange={handleChange} bind:value />
</SettingsWrapper>
