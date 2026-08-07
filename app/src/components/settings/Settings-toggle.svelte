<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Toggle from "$components/Inputs/Toggle.svelte";
    import { onMount } from "svelte";

    type Props = {
        onChange: (value: boolean) => void;
        hidden?: boolean;
        value: boolean;
        defaultValue?: Props["value"];
        param: string;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.checked);
    }

    let { onChange, hidden, value, defaultValue, param }: Props = $props();

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
    settingsDefault={defaultValue}
    onReset={handleReset}
>
    <Toggle onChange={handleChange} bind:checked={value} />
</SettingsWrapper>
