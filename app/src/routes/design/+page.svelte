<script>
    import Button from "$components/Inputs/Button.svelte";
    import Toggle from "$components/Inputs/Toggle.svelte";
    import Checkbox from "$components/Inputs/Checkbox.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Color from "$components/Inputs/Color.svelte";
    import SegmentedControl from "$components/Inputs/Segmented-control.svelte";
    import Selector from "$components/Inputs/Selector.svelte";
    import Dropdown from "$components/Inputs/Dropdown.svelte";
    import { House, ChevronRight, Search } from "lucide-svelte";

    //FIXME MAKE SELECTOR WAY BETTER WITHOUT THE NEED OF THIS
    let selectorOptions = $state([
        { enabled: true, label: "Lorem" },
        { enabled: true, label: "ipsum" },
        { enabled: true, label: "dolor" },
        { enabled: true, label: "sit" },
    ]);
</script>

<main>
    <h1>UChat Design Page</h1>

    {#snippet icon()}
        <House size="1rem" />
    {/snippet}
    {#snippet iconRight()}
        <ChevronRight size="1rem" />
    {/snippet}
    {#snippet iconSearch()}
        <Search size="1rem" />
    {/snippet}

    {#snippet dropdown()}
        <Button>Lorem</Button>
        <Button>ipsum</Button>
        <Button>dolor</Button>
    {/snippet}

    <section>
        <p>Buttons</p>
        <Button {icon}>Lorem ipsum</Button>
        <Button {iconRight}>Lorem ipsum</Button>
        <Button>Lorem ipsum</Button>
    </section>

    <section>
        <p>Dropdown</p>
        <Dropdown {dropdown}>Lorem</Dropdown>
    </section>

    <section>
        <p>Dropdown Reversed</p>
        <Dropdown {dropdown} reversed>Lorem</Dropdown>
    </section>

    <section>
        <p>Toggles</p>
        <Toggle checked={true} />
        <Toggle />
        <Toggle disabled />
    </section>

    <section>
        <p>Checkboxes</p>
        <Checkbox checked={true}>Checked</Checkbox>
        <Checkbox>Unchecked</Checkbox>
    </section>

    <section>
        <p>Inputs</p>
        <Input icon={iconSearch} {iconRight} placeholder="Search..." />
        <Input disabled />
        <Input />
        <Input placeholder="Invalid Input" invalid />
    </section>

    <section>
        <p>Color</p>
        <Color />
    </section>

    <section>
        <p>Segment Control</p>
        <SegmentedControl
            options={[
                { id: "1", label: "Lorem", icon },
                { id: "2", label: "ipsum" },
                { id: "3", label: "dolor" },
                { id: "4", label: "sit" },
            ]}
        />
    </section>

    <section>
        <p>Selector</p>
        <Selector options={selectorOptions} />
    </section>
</main>

<style>
    p,
    h1 {
        margin: 0;
    }

    h1 {
        width: 100%;
    }

    main {
        padding: 0.5rem 1rem;

        width: 100%;

        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 1rem;

        overflow-y: auto;

        section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
    }
</style>
