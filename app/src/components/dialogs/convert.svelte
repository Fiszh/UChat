<script lang="ts">
    import Dialog from "$components/Dialog.svelte";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import { importConfig } from "$lib/import";
    import { addToast } from "$lib/toast";
    import chatis from "$stores/convert/chatis";
    import { config } from "$stores/settings";
    import type { Converter } from "$types/converter";
    import { t } from "svelte-i18n";

    type Props = {
        show: boolean;
    };

    let { show = $bindable(false) }: Props = $props();

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
        if (!input.length) {
            return addToast({
                msg: $t("toasts.no_input"),
                type: "error",
                timeout: 5,
            });
        }

        let url;
        try {
            url = new URL(input);
        } catch (error) {
            return addToast({
                msg: $t("toasts.no_input"),
                type: "error",
                timeout: 5,
            });
        }
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
                        param != "undefined" &&
                        !isDefault(param, value) &&
                        Boolean,
                ),
            );

            const result_url = new URL(window.location.origin);
            const result_params = new URLSearchParams(values);

            const url = result_url + "?" + result_params;

            navigator.clipboard
                .writeText(url)
                .then(() => {
                    addToast({
                        msg: $t("toasts.url_copied"),
                        type: "success",
                        timeout: 5,
                    });

                    importConfig(url);

                    show = false;
                })
                .catch((err) => {
                    console.error("Failed to copy URL: ", err);
                    addToast({
                        msg: $t("toasts.url_copied_fail"),
                        type: "error",
                        timeout: 5,
                    });
                });
        } else {
            return addToast({
                msg: $t("toasts.unsupported"),
                type: "error",
                timeout: 5,
            });
        }
    }
</script>

<Dialog bind:show name={$t("sidebar.convert")} width={35}>
    <div id="layout">
        <h2>
            {$t("pages.convert.title")}
        </h2>
        <p>{$t("pages.convert.warning_bugs")}</p>
        <p>{$t("pages.convert.supported")}</p>
        <h2>{$t("pages.convert.url_input.title")}</h2>

        <Input type="text" bind:value={input} />
        <Button primary wide center onclick={convertURL}>
            {$t("pages.convert.url_input.convert_button")}
        </Button>

        <small>
            {$t("pages.convert.warning_settings")}
        </small>
    </div>
</Dialog>

<style lang="scss">
    #layout {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;

        small {
            color: hsla(0, 0%, 100%, 0.25);
        }
    }
</style>
