<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import { isMobile } from "$stores/global";
    import { onMount } from "svelte";

    type Props = {
        name: string;
        onChange: (value: string) => void;
        description?: string;
        hidden?: boolean;
        value: string;
        defaultValue?: Props["value"];
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let { name, onChange, description, value, hidden, defaultValue }: Props =
        $props();

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
    {name}
    {description}
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
