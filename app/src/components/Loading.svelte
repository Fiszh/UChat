<script lang="ts">
    import LoadingAnimation from "$lib/assets/loading.avif";
    import UChat from "$components/logos/uchat.svelte";

    const availableStyles: string[] = ["minimal", "big", "small"];

    type Props = {
        text?: string;
        type?: string;
        relative?: boolean;
    };

    const { text, type, relative }: Props = $props();
</script>

{#snippet small()}
    <UChat brandColor size="1.5rem" />
    <div class="info">
        {#if text}
            <span class="loading-info">{@html text}</span>
        {:else}
            <span class="loading-text">Loading...</span>
        {/if}
    </div>
    <div class="loader"></div>
{/snippet}

{#snippet minimal()}
    <UChat brandColor size="4rem" />
    <div class="info">
        <span class="loading-info app-title">UChat</span>
        {#if text}
            <span class="loading-info">{@html text}</span>
        {:else}
            <span class="loading-text">Loading...</span>
        {/if}
        <p class="version">{__APP_VERSION}</p>
    </div>
    <div class="loader"></div>
{/snippet}

{#snippet big()}
    <UChat brandColor size="10rem" />
    <div class="info">
        <span class="loading-info app-title">UChat</span>
        <span class="loading-text"
            ><div class="loader"></div>
            Loading...</span
        >
        <span class="loading-info">{@html text}</span>
        <p class="version">{__APP_VERSION}</p>
    </div>
{/snippet}

<div
    class="loading {type}"
    class:relative
    style="display: {type && availableStyles.includes(type) ? 'flex' : 'none'}"
>
    {#if type == "minimal"}
        {@render minimal()}
    {:else if type == "big"}
        {@render big()}
    {:else if type == "small"}
        {@render small()}
    {/if}
</div>

<style lang="scss">
    .loader {
        --size: 2.5rem;

        height: var(--size);
        width: var(--size);
        aspect-ratio: 1/1;

        border: calc(var(--size) * 0.15) solid #222;
        border-top-color: #fff;
        border-radius: 100%;
        animation: spin 0.8s ease-in-out infinite;
    }

    .loading {
        display: flex;
        font-weight: bold;

        box-sizing: border-box;
        padding: 1.1rem 1.5rem;
        background-color: rgba(0, 0, 0, 0.25);

        z-index: 999;

        &:not(.relative) {
            position: absolute;
            transform: translate(-50%, -50%);
        }

        .info {
            align-self: center;

            .version {
                margin: 0;
                font-size: 2rem;
            }

            .loading-text {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;

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

                .loader {
                    --size: 1.75rem;
                }
            }
        }

        &.minimal {
            width: max-content;
            align-items: center;
            flex-direction: row;

            bottom: 5%;
            left: 50%;
            gap: 1rem;
            border-radius: 2.5rem;
            font-size: 1rem;
            padding-inline: 1rem;

            .info {
                display: flex;
                flex-direction: column;
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
            padding-inline: 3rem;

            flex-direction: column;

            gap: 1rem;

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

                .app-title {
                    font-size: 2.5rem;
                }

                .version {
                    font-size: 0.9rem;
                }
            }
        }

        &.small {
            gap: 0.5rem;

            bottom: 8%;
            left: 50%;

            border-radius: 50rem;
            .loader {
                --size: 1.5rem;
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
