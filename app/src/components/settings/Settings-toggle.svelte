<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Toggle from "$components/Inputs/Toggle.svelte";

    type Props = {
        name: string;
        onChange: (value: boolean) => void;
        description?: string;

        hidden?: boolean;
        value: boolean;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.checked);
    }

    let { name, onChange, description, hidden, value }: Props = $props();
</script>

<SettingsWrapper {name} {description} {hidden}>
    <Toggle onChange={handleChange} bind:checked={value} />
</SettingsWrapper>
