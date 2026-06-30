<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Color from "$components/Inputs/Color.svelte";
    import { onMount } from "svelte";

    type Props = {
        name: string;
        onChange: (hex: string) => void;
        description?: string;
        hidden?: boolean;
        value: string;
        defaultValue?: Props["value"];
    };

    const handleChange = (hex: string) => {
        if (typeof onChange != "undefined") return onChange(hex);
    };

    let { name, onChange, description, hidden, value, defaultValue }: Props =
        $props();

    // default will be set to starter value if not set in props
    const handleReset = () => {
        value = defaultValue!;
        onChange(defaultValue!);
    };
    onMount(() => {
        if (!typeof defaultValue) defaultValue = value;
    });
</script>

<SettingsWrapper
    {name}
    {description}
    {hidden}
    {value}
    settingsDefault={defaultValue}
    onReset={handleReset}
>
    <Color onChange={handleChange} bind:value />
</SettingsWrapper>
