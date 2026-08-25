<script lang="ts">
    import { toastNotifs } from "$lib/toast";
    import Notif from "./Notif.svelte";
</script>

<section id="toasts">
    {#each $toastNotifs as toast (toast.id)}
        <Notif {toast} />
    {/each}
</section>

<style lang="scss">
    section {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        z-index: 9999999;
        align-items: center;
        padding: 1rem;
        box-sizing: border-box;
        gap: 0.5rem;
        user-select: none;
        pointer-events: none;
    }
</style>
