<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Color from "$components/Inputs/Color.svelte";

    type Props = {
        name: string;
        onChange: (hex: string) => void;
        description?: string;
        hidden?: boolean;
        value: string;
    };

    const handleChange = (hex: string) => {
        if (typeof onChange != "undefined") return onChange(hex);
    };

    let { name, onChange, description, hidden, value }: Props = $props();
</script>

<SettingsWrapper {name} {description} {hidden}>
    <Color onChange={handleChange} bind:value />
</SettingsWrapper>
