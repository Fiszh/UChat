<script lang="ts">
    import LoadingAnimation from "$lib/assets/loading.avif";

    import { overlayVersion } from "$stores/settings";

    const availableStyles: string[] = ["minimal", "big"];

    const { text, type } = $props<string | undefined>();
</script>

{#snippet minimal()}
    <div class="loader"></div>
    <div class="info">
        <span class="loading-text">Loading...</span>
        <p class="version">{$overlayVersion}</p>
    </div>
{/snippet}

{#snippet big()}
    <img class="loader" src={LoadingAnimation} alt="Loading..." />
    <div class="info">
        <span class="loading-text">Loading...</span>
        <span class="loading-info">{@html text}</span>
        <p class="version">{$overlayVersion}</p>
    </div>
{/snippet}

<div
    class="loading {type}"
    style="display: {type && availableStyles.includes(type) ? 'flex' : 'none'}"
>
    {#if type == "minimal"}
        {@render minimal()}
    {:else if type == "big"}
        {@render big()}
    {/if}
</div>

<style lang="scss">
    .loading {
        display: flex;
        position: absolute;
        transform: translate(-50%, -50%);
        font-weight: bold;

        box-sizing: border-box;
        padding: 1.1rem 1.5rem;
        background-color: rgba(0, 0, 0, 0.25);

        z-index: 99999999;

        .info {
            align-self: center;

            .version {
                margin: 0;
                font-size: 2rem;
            }

            .loading-text {
                background: linear-gradient(
                    90deg,
                    #ffffff 0%,
                    #ffffff 40%,
                    #ffffffa2 50%,
                    #ffffff 60%,
                    #ffffff 100%
                );
                background-size: 200% 100%;
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                animation: bulletTextShine 2s linear infinite;
            }
        }

        &.minimal {
            align-content: center;
            bottom: 5%;
            left: 50%;
            gap: 0.5rem;
            border-radius: 5rem;
            font-size: 1.5rem;

            .loader {
                width: 2.5rem;
                height: 2.5rem;
                border: 0.4rem solid #222;
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.8s ease-in-out infinite;
            }

            .version {
                font-size: 0.7rem;
                color: rgb(199, 199, 199);
            }
        }

        &.big {
            top: 50%;
            left: 50%;
            font-size: 1.2rem;
            border-radius: 1rem;

            flex-direction: column;

            gap: 1rem;

            img {
                max-height: 10rem;
                object-fit: contain;
            }

            .info {
                display: flex;
                flex-direction: column;
                text-align: center;
                gap: 0.2rem;

                .loading-text {
                    font-size: 1.7rem;
                }

                .loading-info {
                    font-size: 1.5rem;
                }

                .version {
                    font-size: 0.9rem;
                }
            }
        }
    }

    /* ANIMATIONS */
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes bulletTextShine {
        0% {
            background-position: 200% 0%;
        }

        100% {
            background-position: 0% 0%;
        }
    }
</style>
