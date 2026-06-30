<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Toggle from "$components/Inputs/Toggle.svelte";
    import { onMount } from "svelte";

    type Props = {
        name: string;
        onChange: (value: boolean) => void;
        description?: string;
        hidden?: boolean;
        value: boolean;
        defaultValue?: Props["value"];
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.checked);
    }

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
    <Toggle onChange={handleChange} bind:checked={value} />
</SettingsWrapper>
