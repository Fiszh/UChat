<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Color from "$components/Inputs/Color.svelte";

    type Props = {
        name: string;
        onChange: (hex: string) => void;
        description?: string;
        value: string;
    };

    const handleChange = (hex: string) => {
        if (typeof onChange != "undefined") return onChange(hex);
    };

    let { name, onChange, description, value }: Props = $props();
</script>

<SettingsWrapper {name} {description}>
    <Color onChange={handleChange} bind:value />
</SettingsWrapper>
