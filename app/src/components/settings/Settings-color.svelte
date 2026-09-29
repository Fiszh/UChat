<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Color from "$components/Inputs/Color.svelte";
    import { onMount } from "svelte";

    type Props = {
        onChange: (hex: string) => void;
        hidden?: boolean;
        value: string;
        defaultValue?: Props["value"];
        previewReact?: boolean;
        param: string;
    };

    const handleChange = (hex: string) => {
        if (typeof onChange != "undefined") return onChange(hex);
    };

    let { onChange, hidden, value, defaultValue, previewReact, param }: Props =
        $props();

    // default will be set to starter value if not set in props
    const handleReset = () => {
        value = defaultValue!;
        onChange(defaultValue!);
    };
    onMount(() => {
        if (typeof defaultValue == "undefined") defaultValue = value;
    });
</script>

<SettingsWrapper
    {param}
    {hidden}
    {value}
    {previewReact}
    settingsDefault={defaultValue}
    onReset={handleReset}
>
    <Color onChange={handleChange} bind:value />
</SettingsWrapper>
