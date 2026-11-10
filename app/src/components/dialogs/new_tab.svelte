<script lang="ts">
    import Dialog from "#components/Dialog.svelte";
    import Button from "#components/Inputs/Button.svelte";
    import Input from "#components/Inputs/Input.svelte";
    import { t } from "svelte-i18n";

    type Props = {
        show: boolean;
        link: string;
    };

    let { show = $bindable(false), link }: Props = $props();
</script>

<Dialog name={$t("dialogs.new_tab.title")} bind:show>
    <div id="layout">
        <h2>{$t("dialogs.new_tab.heading")}</h2>
        <p>
            {$t("dialogs.new_tab.description")}
        </p>
        <Input value={link} readonly />
        <Button
            primary
            href={link}
            onclick={() => (show = false)}
            forceOpenLink
        >
            {$t("dialogs.new_tab.open")}
        </Button>
        <Button secondary onclick={() => (show = false)}>
            {$t("labels.cancel")}
        </Button>
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
