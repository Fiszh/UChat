<script lang="ts">
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import chatis from "$stores/convert/chatis";
    import { config } from "$stores/settings";
    import type { Converter } from "$types/converter";
    import { t } from "svelte-i18n";

    let input = $state("");

    const mappedConfig = config.reduce(
        (acc, cfg) => {
            acc[cfg["param"]] = {
                type: cfg["type"],
                default: cfg["default"],
            };
            return acc;
        },
        {} as Record<
            string,
            { type: string; default: string | number | boolean | undefined }
        >,
    );

    function isDefault(param: string, value: string): boolean {
        const cfg = mappedConfig[param];
        if (!cfg || !cfg["default"]) return false;
        let defaultValue = cfg["default"];

        switch (cfg["type"]) {
            case "boolean":
                defaultValue = String(Number(defaultValue == "true"));

                break;
            case "number":
                defaultValue = String(defaultValue);

                break;
            default:
                break;
        }

        if (value == defaultValue) return true;

        return false;
    }

    function convertURL() {
        if (!input.length) return alert($t("toasts.no_input"));
        const url = new URL(input);
        const params = url.searchParams.entries();

        if (
            input.startsWith("https://chatis.is2511.com") ||
            input.startsWith("https://giambaj.it")
        ) {
            let values = [...params].reduce<Record<string, string>>(
                (acc, [param, value]: [string, string]) => {
                    if (chatis[param]) {
                        const ChatParam = chatis[param];

                        const values = ChatParam.reduce<Record<string, string>>(
                            (
                                acc: Record<string, string>,
                                ReplaceParam: Converter.Param,
                            ) => {
                                if (acc[ReplaceParam.param]) {
                                    if (!ReplaceParam.priority) return acc;

                                    delete acc[ReplaceParam.param];
                                }

                                if (ReplaceParam["values"] === null)
                                    acc[ReplaceParam["param"]] = value;
                                else if (ReplaceParam["values"] === "boolean")
                                    acc[ReplaceParam["param"]] = String(
                                        Number(value == "true"),
                                    );
                                else if (!Array.isArray(ReplaceParam["values"]))
                                    acc[ReplaceParam["param"]] =
                                        ReplaceParam["values"][value];
                                else if (Array.isArray(ReplaceParam["values"]))
                                    acc = {
                                        ...acc,
                                        ...Object.fromEntries(
                                            ReplaceParam["values"].map(
                                                (
                                                    val: Converter.ConditionalValue,
                                                ) => {
                                                    if (val["values"][value]) {
                                                        return [
                                                            ReplaceParam[
                                                                "param"
                                                            ],
                                                            val["values"][
                                                                value
                                                            ],
                                                        ];
                                                    } else {
                                                        return [];
                                                    }
                                                },
                                            ),
                                        ),
                                    };

                                return acc;
                            },
                            {},
                        );

                        acc = {
                            ...acc,
                            ...values,
                        };
                    }

                    return acc;
                },
                {},
            );

            values = Object.fromEntries(
                Object.entries(values).filter(
                    ([param, value]) =>
                        param != "undefined" && !isDefault(param, value),
                ),
            );

            const result_url = new URL("https://chat.unii.dev/");
            const result_params = new URLSearchParams(values);

            navigator.clipboard
                .writeText(result_url + "?" + result_params)
                .then(() => alert($t("toasts.url_copied")))
                .catch((err) => {
                    console.error("Failed to copy URL: ", err);
                    alert($t("toasts.url_copied_fail"));
                });
        } else {
            return alert($t("toasts.unsupported"));
        }
    }
</script>

<section id="layout">
    <h1>
        {$t("pages.convert.title")}
    </h1>
    <p>{$t("pages.convert.warning_bugs")}</p>
    <p>
        {$t("pages.convert.warning_settings")}
    </p>
    <p>{$t("pages.convert.supported")}</p>

    <section id="url-input">
        <h2>{$t("pages.convert.url_input.title")}</h2>
        <Input type="text" bind:value={input} />

        <Button primary onclick={convertURL}>
            {$t("pages.convert.url_input.convert_button")}
        </Button>
    </section>
</section>

<style lang="scss">
    @use "sass:color";

    #layout {
        width: 100%;
        height: 100%;

        padding-block: 2.5rem;

        #url-input {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        text-align: center;

        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 0.5rem;
    }
</style>
