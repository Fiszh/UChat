<script lang="ts">
    import { dismissToast, type ToastNotif } from "$lib/toast";
    import { Check, Info, TriangleAlert, X } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    type Props = {
        toast: ToastNotif;
    };

    const { toast }: Props = $props();

    let depleted = $state(false);
    let accent = $state("var(--accent)");

    // no need for a onmount really
    // svelte-ignore state_referenced_locally
    switch (toast["type"]) {
        case "error":
            accent = "#e24b4a";

            break;
        case "success":
            accent = "#639922";

            break;
        default:
            break;
    }

    // svelte-ignore state_referenced_locally
    const animTime = toast.timeout + "ms";

    onMount(() => requestAnimationFrame(() => (depleted = true)));
</script>

<div
    class="toast"
    data-type={toast.type}
    transition:fly
    style="--toast-accent: {accent}; --anim-time: {animTime};"
>
    <div id="layout">
        {#if toast.type == "error"}
            <TriangleAlert color="var(--toast-accent)" />
        {:else if toast.type == "success"}
            <Check color="var(--toast-accent)" />
        {:else}
            <Info color="var(--toast-accent)" />
        {/if}
        <span>{toast.msg}</span>
        <button onclick={() => dismissToast(toast.id)}>
            <X color="currentColor" />
        </button>
    </div>
    {#if !("timeout" in toast) || toast["timeout"] > 0}
        <div id="progress"><div id="bar" class:depleted></div></div>
    {/if}
</div>

<style lang="scss">
    .toast {
        display: flex;
        flex-direction: column;
        background: #151515;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        overflow: hidden;

        #progress {
            height: 0.25rem;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.064);

            #bar {
                background-color: var(--toast-accent);
                height: 100%;
                width: 100%;
                transition: width var(--anim-time) linear;

                &.depleted {
                    width: 0%;
                }
            }
        }
    }

    #layout {
        display: flex;
        align-items: center;
        gap: 10px;
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
