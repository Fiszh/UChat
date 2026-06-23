<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import { isMobile } from "$stores/global";

    type Props = {
        name: string;
        onChange: (value: string) => void;
        description?: string;
        hidden?: boolean;
        value: string | number;
        defaultValue: string | number;
    };

    function handleChange(e: Event) {
        if (typeof onChange == "undefined") return;

        if (e.currentTarget instanceof HTMLInputElement)
            onChange(e.currentTarget.value);
    }

    let { name, onChange, description, value, hidden, defaultValue }: Props =
        $props();
</script>

<SettingsWrapper {name} {description} {hidden} column={$isMobile}>
    <Input
        onChange={handleChange}
        bind:value
        wide={$isMobile}
        placeholder={String(defaultValue)}
    />
</SettingsWrapper>
