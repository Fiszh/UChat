<script lang="ts">
    import { type Component } from "svelte";
    import Kick from "./logos/kick.svelte";
    import Twitch from "./logos/twitch.svelte";
    import Youtube from "./logos/youtube.svelte";

    export type Brands = "twitch" | "kick" | "youtube";

    let { brand = $bindable("twitch") }: { brand: Brands } = $props();
</script>

{#snippet brandButton(
    Logo: Component<{ brandColor: boolean }>,
    brandName: Brands,
    disabled?: boolean,
)}
    <button
        onclick={() => (disabled ? null : (brand = brandName))}
        class:disabled
        title={disabled ? "Unviable" : ""}
    >
        <Logo brandColor={brand == brandName} />
    </button>
{/snippet}

{@render brandButton(Twitch, "twitch")}
{@render brandButton(Kick, "kick")}
{@render brandButton(Youtube, "youtube", true)}

<style lang="scss">
    button {
        color: white;
        padding: 0.25rem;
        box-sizing: border-box;
        aspect-ratio: 1;
        border: none;
        border-radius: 0.25rem;

        background: none;

        cursor: pointer;

        &.disabled {
            opacity: 0.35;
            cursor: not-allowed;
            filter: contrast(0.5);
        }

        &:not(.disabled):hover {
            background: #ffffff19;
        }
    }
</style>
