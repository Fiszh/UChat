<script lang="ts">
    import chatis from "$stores/convert/chatis";
    import { config } from "$stores/settings";
    import type { Converter } from "$types/converter";

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
        if (!input.length) return alert("no input");
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
                .then(() => {
                    alert("Overlay URL has been copied!");
                })
                .catch((err) => {
                    console.error("Failed to copy URL: ", err);
                    alert(
                        "Failed to copy URL, check the console for more info.",
                    );
                });
        } else {
            return alert("Unsupported.");
        }
    }
</script>

<section id="layout">
    <h1>Convert your chat overlay settings to UChat</h1>
    <p>Bugs could occur, please be aware.</p>
    <p>Not every setting exists in UChat.</p>
    <p>Currently supported: JChat & ChatIS.</p>

    <section id="url-input">
        <h2>Chat Overlay URL:</h2>
        <input type="text" bind:value={input} />

        <button onclick={convertURL}>Convert & Copy</button>
    </section>
</section>

<style lang="scss">
    @use "sass:color";

    #layout {
        width: 100%;
        height: 100%;

        padding-block: 2.5rem;

        p,
        h2,
        h1 {
            margin: 0;
        }

        #url-input {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        input[type="text"] {
            color: white;
            width: 25rem;
            height: 3rem;
            border-radius: 0.5rem;
            border: none;
            background-color: rgba(255, 255, 255, 0.05);
            font-size: 1.7rem;
            text-align: center;

            outline: transparent 1px solid;
            transition: outline-color 0.3s ease;

            &:hover,
            &:active,
            &:focus-within {
                outline-color: #242424;
            }
        }

        button {
            $background: #141414;
            $border: #242424;

            all: unset;
            cursor: pointer;
            width: 95%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;
            padding: 0.6rem 0.7rem;
            box-sizing: border-box;
            background-color: $background;
            transition: all 0.1s ease-in-out;
            border-radius: 0.7rem;
            border: 1px solid $border;

            &:hover {
                background-color: color.adjust($background, $lightness: 5%);
                border-radius: 0.5rem;
                width: 100%;
                border-color: color.adjust($border, $lightness: 5%);
            }
        }

        text-align: center;

        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 0.5rem;
    }
</style>
