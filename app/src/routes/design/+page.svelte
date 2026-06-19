<script>
    import Button from "$components/Inputs/Button.svelte";
    import Toggle from "$components/Inputs/Toggle.svelte";
    import Checkbox from "$components/Inputs/Checkbox.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Color from "$components/Inputs/Color.svelte";
    import SegmentedControl from "$components/Inputs/Segmented-control.svelte";
    import Selector from "$components/Inputs/Selector.svelte";
    import { House, ChevronRight, Search } from "lucide-svelte";

    //FIXME MAKE SELECTOR WAY BETTER WITHOUT THE NEED OF THIS
    let selectorOptions = $state([
        { enabled: true, label: "Twitch" },
        { enabled: true, label: "Kick" },
        { enabled: true, label: "YouTube" },
        { enabled: true, label: "TikTok" },
    ]);
</script>

<main>
    <h1>UChat Design Page</h1>

    <p>Buttons</p>
    {#snippet icon()}
        <House size="1rem" />
    {/snippet}
    {#snippet iconRight()}
        <ChevronRight size="1rem" />
    {/snippet}
    {#snippet iconSearch()}
        <Search size="1rem" />
    {/snippet}
    <Button {icon}>Test Button</Button>
    <Button {iconRight}>Test Button</Button>
    <Button>Test Button</Button>

    <p>Toggles</p>
    <Toggle checked={true} />
    <Toggle />
    <Toggle disabled />

    <p>Checkboxes</p>
    <Checkbox checked={true}>Checked</Checkbox>
    <Checkbox>Unchecked</Checkbox>

    <p>Inputs</p>
    <Input icon={iconSearch} {iconRight} placeholder="Search..." />
    <Input disabled />
    <Input placeholder="Invalid Input" invalid />

    <p>Color</p>
    <Color />

    <p>Segment Control</p>
    <SegmentedControl
        options={[
            { id: "twitch", label: "Twitch", icon },
            { id: "kick", label: "Kick" },
            { id: "yt", label: "YouTube" },
            { id: "tt", label: "TikTok" },
        ]}
    />

    <p>Selector</p>
    <Selector options={selectorOptions} />
</main>

<style>
    p,
    h1 {
        margin: 0;
    }

    main {
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        overflow-y: auto;
    }
</style>
