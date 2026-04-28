<script lang="ts">
    let { badge_url, alt, background_color } = $props<string>();
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
