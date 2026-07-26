<script lang="ts">
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

{#snippet EmoteMultipleURLS(emote: ParsedEmoteMultiple)}
    <picture>
        {#each getGroups(emote.urls) as group}
            <source
                srcset={group.url}
                type={group.type != "group"
                    ? "image/" + group.type.toLowerCase()
                    : ""}
            />
        {/each}
        <img src={emote.urls[0].url} alt="emote" loading="lazy" class="emote" />
    </picture>
{/snippet}

{#snippet EmoteSingleURL(
    emote:
        | ParsedEmoteSingle
        | EmoteParser.FoundBits["bits"]
        | EmoteParser.FoundEmoji["emoji"],
)}
    <img
        draggable="false"
        src={emote["url"]}
        alt={emote["name"]}
        loading="lazy"
        class="emote"
    />
{/snippet}

{#snippet Emote(
    emote:
        | ParsedEmote
        | EmoteParser.FoundBits["bits"]
        | EmoteParser.FoundEmoji["emoji"],
)}
    {#if "urls" in emote && !("url" in emote)}
        {@render EmoteMultipleURLS(emote)}
    {:else if "url" in emote && !("urls" in emote)}
        {@render EmoteSingleURL(emote)}
    {/if}
{/snippet}

<span
    class={"bits" in emoteInfo ? "bits-wrapper" : "emote-wrapper"}
    style="color: {'bits' in emoteInfo
        ? emoteInfo['bits']['color']
        : 'currentColor'};"
>
    {#if "emote" in emoteInfo}
        {@render Emote(emoteInfo["emote"] as ParsedEmoteMultiple)}
    {:else if "emoji" in emoteInfo}
        {@render Emote(emoteInfo["emoji"])}
    {:else if "bits" in emoteInfo}
        {@render Emote(emoteInfo["bits"])}
        {emoteInfo["bits"]["bits"]}
    {:else}
        {@render Emote(emoteInfo)}
    {/if}

    {#if "overlapped" in emoteInfo}
        {#each emoteInfo["overlapped"] as overlapped}
            {@render Emote(overlapped)}
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

        img {
            object-fit: contain;
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
