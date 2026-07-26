<script lang="ts">
    import { dismissToast, type ToastNotif } from "$lib/toast";
    import { Check, Info, TriangleAlert, X } from "@lucide/svelte";
    import { fly } from "svelte/transition";

    type Props = {
        toast: ToastNotif;
    };

    const { toast }: Props = $props();
</script>

<div data-type={toast.type} transition:fly>
    {#if toast.type == "error"}
        <TriangleAlert color="#e24b4a" />
    {:else if toast.type == "success"}
        <Check color="#639922" />
    {:else}
        <Info color="#7f77dd" />
    {/if}
    <span>{toast.msg}</span>
    <button onclick={() => dismissToast(toast.id)}>
        <X color="currentColor" />
    </button>
</div>

<style lang="scss">
    div {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #151515;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        padding: 12px 14px;
        color: #f0ede8;
        font-size: 13px;

        button {
            cursor: pointer;
            color: #6b6b68;
            pointer-events: all;

            &:hover {
                color: #80807b;
            }
        }
    }
</style>
