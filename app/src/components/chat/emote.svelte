<script lang="ts">
    import { sanitizeInput } from "$lib/chat";

    type Props = {
        emoteInfo:
            | EmoteParser.FoundEmote
            | ParsedEmote
            | EmoteParser.FoundBits
            | EmoteParser.FoundEmoji;
    };

    interface imageGroup {
        url: string;
        width: number;
    }

    const { emoteInfo }: Props = $props();

    const getFFZFlags = (emote: Props["emoteInfo"]) =>
        "FFZTags" in emote ? emote["FFZTags"] : [""];

    function getGroups(urls: ParsedEmoteMultiple["urls"]) {
        const parsedGroups = urls.reduce<Record<string, imageGroup[]>>(
            (acc, url) => {
                if ("format" in url && typeof url["format"] == "string") {
                    acc = {
                        ...acc,
                        [url["format"]]: [
                            ...(acc[url["format"]] ? acc[url["format"]] : []),
                            { url: url["url"], width: url["width"] },
                        ],
                    };
                } else {
                    acc = {
                        ...acc,
                        group: [
                            ...(acc["group"] ? acc["group"] : []),
                            { url: url["url"], width: url["width"] },
                        ],
                    };
                }

                return acc;
            },
            {},
        );

        return Object.entries(parsedGroups).map(([type, group]) => ({
            url: group
                .map((g) => g["url"] + " " + String(g["width"]) + "w")
                .join(", "),
            type,
        }));
    }
</script>

{#snippet EmoteMultipleURLS(emote: ParsedEmoteMultiple, flags?: string[])}
    <picture>
        {#each getGroups(emote.urls) as group}
            <source
                srcset={group.url}
                type={group.type != "group"
                    ? "image/" + group.type.toLowerCase()
                    : ""}
            />
        {/each}
        <img
            draggable="false"
            src={emote.urls[0]?.url}
            alt={emote["name"]}
            loading="lazy"
            class="emote {flags?.join(' ')}"
        />
    </picture>
{/snippet}

{#snippet EmoteSingleURL(
    emote:
        | ParsedEmoteSingle
        | EmoteParser.FoundBits["bits"]
        | EmoteParser.FoundEmoji["emoji"],
    flags?: string[],
)}
    <img
        draggable="false"
        src={emote["url"]}
        alt={emote["name"]}
        loading="lazy"
        class="emote {flags?.join(' ')}"
    />
{/snippet}

{#snippet Emote(
    emote:
        | ParsedEmote
        | EmoteParser.FoundBits["bits"]
        | EmoteParser.FoundEmoji["emoji"],
    flags?: string[],
)}
    {#if "urls" in emote && emote["urls"]?.length && !("url" in emote)}
        {@render EmoteMultipleURLS(emote, flags)}
    {:else if "url" in emote && !("urls" in emote)}
        {@render EmoteSingleURL(emote, flags)}
    {:else}
        {@html sanitizeInput(emote.name)}
    {/if}
{/snippet}

<span
    class="emote-wrapper"
    style="color: {'bits' in emoteInfo
        ? emoteInfo['bits']['color']
        : 'currentColor'};"
>
    {#if "emote" in emoteInfo}
        {@render Emote(emoteInfo["emote"], getFFZFlags(emoteInfo))}
    {:else if "emoji" in emoteInfo}
        {@render Emote(emoteInfo["emoji"], getFFZFlags(emoteInfo))}
    {:else if "bits" in emoteInfo}
        <span class="bits">
            {@render Emote(emoteInfo["bits"])}
            {emoteInfo["bits"]["bits"]}
        </span>
    {:else}
        {@render Emote(emoteInfo)}
    {/if}

    {#if "overlapped" in emoteInfo}
        {#each emoteInfo["overlapped"] as overlapped}
            {@render Emote(overlapped, getFFZFlags(overlapped))}
        {/each}
    {/if}
</span>

<style lang="scss">
    .emote-wrapper {
        display: inline-grid;
        grid-auto-rows: 0px;

        box-sizing: border-box;

        position: relative;

        line-height: normal;
        vertical-align: middle;

        height: min-content;

        font-size: inherit;

        .bits {
            display: flex;
        }

        img {
            object-fit: contain;
            z-index: 0;
        }

        picture {
            display: contents;
        }

        .emote {
            justify-self: center;
            height: 100vh;
        }
    }
</style>
