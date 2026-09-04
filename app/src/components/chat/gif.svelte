<script lang="ts">
    import { onMount } from "svelte";

    type Props = {
        url: string;
    };

    const { url }: Props = $props();

    let cleanUrl = $state("");

    onMount(() => {
        const match = url.match(/https:\/\/.*/);
        cleanUrl = match ? match[0] : url;
    });
</script>

<span class="gif-wrapper">
    <img
        draggable="false"
        src={cleanUrl}
        alt="gif"
        loading="lazy"
        class="gif"
    />
</span>

<style lang="scss">
    .gif-wrapper {
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

        .gif {
            justify-self: center;
            height: 100vh;
        }
    }
</style>
