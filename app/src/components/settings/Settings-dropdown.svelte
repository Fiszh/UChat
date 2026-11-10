<script lang="ts">
    import SettingsWrapper from "./Settings-wrapper.svelte";
    import { isMobile } from "#stores/global.js";
    import { onMount, untrack } from "svelte";
    import type { DropdownSetting } from "#stores/settings.js";
    import Dropdown from "#components/Inputs/Dropdown.svelte";
    import Button from "#components/Inputs/Button.svelte";

    type Props = {
        onChange: (value: string) => void;
        hidden?: boolean;
        value: string;
        preload: DropdownSetting["preload"];
        load: DropdownSetting["load"];
        defaultValue?: Props["value"];
        previewReact?: boolean;
        param: string;
    };

    let {
        onChange,
        value,
        preload,
        load,
        hidden,
        defaultValue,
        previewReact,
        param,
    }: Props = $props();

    let dropdownEl;

    let items = $state<string[]>([]);

    const listExpanded = async () => {
        if (typeof load == "function") items = await load();
    };

    // default will be set to starter value if not set in props
    const handleReset = () => {
        value = defaultValue!;
        onChange("");
        dropdownEl!.clearQuery();
    };
    onMount(() => {
        if (typeof defaultValue == "undefined") defaultValue = value;

        if (defaultValue == value) {
            value = "";
            onChange(value);
        }

        if (Array.isArray(preload)) items = preload;
    });

    function setValue(item: string) {
        if (item == defaultValue) {
            handleReset();
        } else {
            onChange(item);
            value = item;
        }

        dropdownEl!.clearQuery();
    }

    let searchQuery = $state("");
    let searchResults = $state<string[]>([]);

    function search(query: string) {
        if (!query.trim().length) return items;

        return items.filter((i) =>
            i.toLowerCase().trim().includes(query.toLowerCase().trim()),
        );
    }

    $effect(() => {
        searchResults = search(searchQuery);

        if (searchQuery) untrack(() => onChange(searchQuery));
    });
</script>

{#snippet dropdown()}
    {#each searchResults.length ? searchResults : new Set( [defaultValue ?? "", ...items] ) as item}
        <Button onclick={() => setValue(item)}>{item}</Button>
    {/each}
{/snippet}

<SettingsWrapper
    {param}
    {hidden}
    {value}
    {previewReact}
    column={$isMobile}
    settingsDefault={""}
    onReset={handleReset}
>
    <Dropdown
        bind:this={dropdownEl}
        {dropdown}
        {listExpanded}
        bind:value
        bind:query={searchQuery}
        searchable
        placeholder={String(defaultValue)}
    />
</SettingsWrapper>
