<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import { onMount } from "svelte";
    import Slider from "$components/Inputs/Slider.svelte";
    import { isMobile } from "$stores/global";

    type Props = {
        name: string;
        onChange: (value: string) => void;
        description?: string;
        hidden?: boolean;
        value: string;
        min?: string;
        max: string;
        defaultValue?: Props["value"];
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let {
        name,
        onChange,
        description,
        hidden,
        value = $bindable(),
        defaultValue,
        min,
        max,
    }: Props = $props();

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
    column={$isMobile}
>
    <Slider
        {min}
        {max}
        onChange={handleChange}
        {value}
        wide={$isMobile}
        displayValue
    />
</SettingsWrapper>
