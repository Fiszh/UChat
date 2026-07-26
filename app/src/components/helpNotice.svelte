<script lang="ts">
    import type { Snippet } from "svelte";
    import { t } from "svelte-i18n";

    type Props = {
        children?: Snippet;
    };

    const { children }: Props = $props();
</script>

<span>
    {@render children?.()}
    <a href="/help#notice">[{$t("labels.learn_more")}]</a>
</span>

<style langs="scss">
    span {
        margin-bottom: 5px;
        text-align: center;
        display: block;
    }
</style>
