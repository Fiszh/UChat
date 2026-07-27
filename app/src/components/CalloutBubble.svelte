<script lang="ts">
    import type { Snippet } from "svelte";
    import { fly } from "svelte/transition";

    type Props = {
        type?: "message" | "error";
        relative?: boolean;
        children: Snippet;
    };

    const { type = "message", relative, children }: Props = $props();
</script>

<div data-type={type} data-relative={relative} transition:fly>
    <span>{@render children()}</span>
    <p id="bottom-triangle"></p>
</div>

<style lang="scss">
    div {
        gap: 10px;
        position: absolute;
        color: black;
        left: 50%;
        transform: translateX(-50%);
        top: -115%;

        pointer-events: none;

        & > * {
            background: white;
        }

        &[data-type="error"] {
            color: white;

            & > * {
                background: #ff6d6d;
            }
        }

        &[data-relative] {
            position: relative;
        }

        span {
            position: relative;
            z-index: 1;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
        }

        #bottom-triangle {
            position: absolute;
            z-index: 0;
            height: 1rem;
            width: 1rem;
            left: 50%;
            top: 100%;
            transform: translate(-50%, -15%) rotate(45deg);
        }
    }

    @media (max-width: 768px) {
        div {
            top: -125%;
            transform: translateX(-50%);

            span {
                border-radius: 0.25rem;
                padding: 0.25rem 0.5rem;
            }

            #bottom-triangle {
                height: 0.75rem;
                width: 0.75rem;
                top: 80%;
            }
        }
    }
</style>
