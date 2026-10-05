<script lang="ts">
    import Dialog from "$components/Dialog.svelte";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";

    type Props = {
        show: boolean;
        link: string;
    };

    let { show = $bindable(false), link }: Props = $props();
</script>

<Dialog name="Heads up" bind:show>
    <div id="layout">
        <h2>This will open in a new tab</h2>
        <p>
            This page stays right where it is, so you can hop back whenever you
            like.
        </p>
        <Input value={link} readonly />
        <Button
            primary
            href={link}
            onclick={() => (show = false)}
            forceOpenLink
        >
            Open
        </Button>
        <Button secondary onclick={() => (show = false)}>Cancel</Button>
    </div>
</Dialog>

<style lang="scss">
    #layout {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h2 {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
    }
</style>
