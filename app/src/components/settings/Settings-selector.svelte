<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import { onMount } from "svelte";
    import Selector from "$components/Inputs/Selector.svelte";
    import type { SelectorSetting } from "$stores/settings";
    import { isMobile } from "$stores/global";

    type Props = {
        onChange: (v: number) => void;
        hidden?: boolean;
        value: number;
        defaultValue?: number;
        selectors: SelectorSetting["selectors"];
        previewReact?: boolean;
        param: string;
    };

    const handleChange = (v: number) => {
        if (typeof onChange != "undefined") return onChange(v);
    };

    let {
        onChange,
        hidden,
        value,
        defaultValue,
        previewReact,
        selectors,
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
    {previewReact}
    column={$isMobile}
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
