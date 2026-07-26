<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import { onMount } from "svelte";
    import Selector from "$components/Inputs/Selector.svelte";
    import type { SelectorSetting } from "$stores/settings";
    import { isMobile } from "$stores/global";

    type Props = {
        name: string;
        onChange: (v: number) => void;
        description?: string;
        hidden?: boolean;
        value: number;
        defaultValue?: number;
        selectors: SelectorSetting["selectors"];
    };

    const handleChange = (v: number) => {
        if (typeof onChange != "undefined") return onChange(v);
    };

    let {
        name,
        onChange,
        description,
        hidden,
        value,
        defaultValue,
        selectors,
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
    column={$isMobile}
    {name}
    {description}
    {hidden}
    {value}
    settingsDefault={defaultValue}
    onReset={handleReset}
>
    <Selector
        options={selectors}
        bitmap={value}
        quickOptions
        onChange={handleChange}
    />
</SettingsWrapper>
