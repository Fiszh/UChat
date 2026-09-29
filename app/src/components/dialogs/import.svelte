<script lang="ts">
    import Dialog from "$components/Dialog.svelte";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import { importConfig } from "$lib/import";
    import { addToast } from "$lib/toast";
    import { Import } from "@lucide/svelte";
    import { t } from "svelte-i18n";

    type Props = {
        show: boolean;
    };

    let { show = $bindable(false) }: Props = $props();

    let input = $state("");

    function startImport() {
        importConfig(input)
            .then(() => {
                addToast({
                    msg: "Succesfully imported settings!",
                    type: "success",
                    timeout: 5,
                });

                input = "";
                show = false;
            })
            .catch((err: unknown) => {
                console.error(err instanceof Error ? err.message : err);

                addToast({
                    msg: "Failed importing settings...",
                    type: "error",
                    timeout: 5,
                });
            });
    }
</script>

{#snippet ImportIcon()}
    <Import />
{/snippet}

{#snippet Buttons()}
    <Button primary wide center icon={ImportIcon} onclick={startImport}>
        Import
    </Button>
{/snippet}

<Dialog bind:show name="Import" width={35} buttons={Buttons}>
    <div id="layout">
        <h2>Import your UChat configuration</h2>
        <h2>{$t("pages.convert.url_input.title")}</h2>

        <Input
            type="text"
            bind:value={input}
            placeholder={window.location.origin + "..."}
        />
    </div>
</Dialog>

<style lang="scss">
    #layout {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
</style>
