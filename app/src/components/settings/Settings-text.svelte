<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import { isMobile } from "$stores/global";
    import { onMount } from "svelte";

    type Props = {
        onChange: (value: string) => void;
        hidden?: boolean;
        value: string;
        defaultValue?: Props["value"];
        param: string;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let { onChange, value, hidden, defaultValue, param }: Props = $props();

    // default will be set to starter value if not set in props
    const handleReset = () => {
        value = defaultValue!;
        onChange(String(defaultValue));
    };
    onMount(() => {
        if (typeof defaultValue == "undefined") defaultValue = value;

        if (defaultValue == value) {
            value = "";
            onChange(value);
        }
    });
</script>

<SettingsWrapper
    {param}
    {hidden}
    column={$isMobile}
    {value}
    settingsDefault={""}
    onReset={handleReset}
>
    <Input
        onChange={handleChange}
        bind:value
        wide={$isMobile}
        placeholder={String(defaultValue)}
    />
</SettingsWrapper>
