<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import { onMount } from "svelte";
    import Slider from "$components/Inputs/Slider.svelte";
    import { isMobile } from "$stores/global";

    type Props = {
        onChange: (value: string) => void;
        hidden?: boolean;
        value: string;
        min?: string;
        max: string;
        defaultValue?: Props["value"];
        param: string;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let {
        onChange,
        hidden,
        value = $bindable(),
        defaultValue,
        min,
        max,
        param,
    }: Props = $props();

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
