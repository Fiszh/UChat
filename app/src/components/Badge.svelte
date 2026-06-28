<script lang="ts">
    type Props = {
        badge_url: string;
        alt: string;
        background_color: string;
    };

    const { badge_url, alt, background_color } = $props();
</script>

<img
    class="badge"
    style="background-color: {background_color || 'transparent'};"
    src={badge_url}
    {alt}
    loading="lazy"
/>

<style>
    img {
        height: var(--chat-font-size);
        width: var(--chat-font-size);
        object-fit: contain;
    }
</style>
