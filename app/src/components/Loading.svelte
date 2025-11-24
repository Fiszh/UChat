<script lang="ts">
    import LoadingAnimation from "$lib/assets/loading.avif";

    const availableStyles: string[] = ["minimal", "big"];

    export let loading: {
        text: string | undefined;
        type: string | undefined;
    };
</script>

{#snippet minimal()}
    <div class="loader"></div>
    <div class="info">
        <span class="loading-text">Loading...</span>
        <p class="version">version: 0.1</p>
    </div>
{/snippet}

{#snippet big()}
    <img class="loader" src={LoadingAnimation} alt="Loading..." />
    <div class="info">
        <span class="loading-text">Loading...</span>
        <span class="loading-info">{@html loading.text}</span>
        <p class="version">version: 0.1</p>
    </div>
{/snippet}

<div
    class="loading {loading.type}"
    style="display: {loading.type && availableStyles.includes(loading.type)
        ? 'flex'
        : 'none'}"
>
    {#if loading.type == "minimal"}
        {@render minimal()}
    {:else if loading.type == "big"}
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

        .info {
            align-self: center;

            .version {
                margin: 0;
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
