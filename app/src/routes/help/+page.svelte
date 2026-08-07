<script lang="ts">
    import { onMount } from "svelte";

    import { CircleQuestionMark, ShieldCheck } from "@lucide/svelte";

    import { faqItems } from "$stores/faq";
    import { t } from "svelte-i18n";

    let helpNotice: HTMLElement;

    function replaceLinks(
        answer: string,
        links: (
            { name: string; url: string } | { nameKey: string; url: string }
        )[],
    ) {
        if (!links.length) return answer;

        let Answer = answer;
        for (const link of links) {
            if ("name" in link) {
                Answer = Answer.replace(
                    "{" + link.name.toLowerCase() + "}",
                    `<a href="${link.url}" target="_blank" rel="noopener noreferrer nofollow">${link.name}</a>`,
                );
            } else {
                const name = $t(link.nameKey);

                Answer = Answer.replace(
                    name,
                    `<a href="${link.url}" target="_blank" rel="noopener noreferrer nofollow">${name}</a>`,
                );
            }
        }

        return Answer;
    }

    const copy = (text: string) => navigator.clipboard.writeText(text);

    onMount(() => {
        if (window.location.hash == "#notice")
            helpNotice?.scrollIntoView({ behavior: "smooth" });
    });

    const privacyKeys = Array.from({ length: 7 }, (_, i) => `item_${i + 1}`);

    const privacyItems = privacyKeys.map((key) =>
        $t(`pages.help.privacy_items.${key}`),
    );
</script>

<div id="faq-container">
    <section>
        <h2>{$t("pages.help.info.title")}</h2>
        <h3>
            {$t("pages.help.info.description")}
        </h3>
    </section>

    <h5>
        <CircleQuestionMark size="2rem" />
        {$t("pages.help.faq")}
    </h5>

    <section id="help-items" class="faq-items">
        {#each faqItems as faqItem, i}
            <div class="faq-item">
                <h4>{$t(faqItem.i18nKey + ".question")}</h4>
                <p>
                    {#if faqItem.links}
                        {@html replaceLinks(
                            $t(faqItem.i18nKey + ".answer"),
                            faqItem.links,
                        )}
                    {:else}
                        {$t(faqItem.i18nKey + ".answer")}
                    {/if}
                </p>
                {#if faqItem.commands}
                    <ul class="commands">
                        {#each faqItem.commands as command}
                            <li>
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <code onclick={() => copy(command.cmd)}>
                                    {command.cmd}
                                </code>
                                - {$t(command.descKey)}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            {#if i < faqItems.length - 1}
                <hr />
            {/if}
        {/each}
    </section>

    <h5>
        <ShieldCheck size="2rem" />
        {$t("pages.help.privacy")}
    </h5>

    <section id="help-notice" class="faq-items" bind:this={helpNotice}>
        {#each privacyItems as pricacyItem}
            <div class="faq-item">
                <p>
                    {@html pricacyItem}
                </p>
            </div>
        {/each}
    </section>
</div>

<style lang="scss">
    #faq-container {
        overflow-y: auto;

        padding-inline: 5rem;
        padding-block: 1rem 2.5rem;
        box-sizing: border-box;

        width: 100%;
        height: 100%;

        align-items: center;
        text-align: center;

        display: flex;
        flex-direction: column;

        gap: 1.5rem;

        h5 {
            display: flex;
            gap: 0.3rem;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            text-align: center;
            line-height: 0;
        }

        .faq-items {
            border-radius: 1rem;
            border: #161616 1px solid;
            background-color: rgba(255, 255, 255, 0.014);
            width: 100%;
        }

        .faq-item {
            text-align: left;

            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            padding: 1rem 1.25rem;
            box-sizing: border-box;

            :global(a) {
                display: inline;
            }

            .commands {
                display: flex;
                flex-direction: column;

                gap: 0.3rem;
                padding: 1.3rem 1rem;
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, 0.014);

                border: #161616 1px solid;
                border-radius: 1rem;

                list-style-type: none;

                code {
                    font-size: 1rem;
                    cursor: pointer;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        #faq-container {
            padding: 0.3rem 1rem 2.5rem 1rem;
        }
    }
</style>
