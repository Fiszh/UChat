<script lang="ts">
    export let badge: {
        badge_url: string;
        alt: string;
        background_color: string;
    };
</script>

<img
    class="badge"
    style="background-color: {badge.background_color || 'transparent'};"
    src={badge.badge_url}
    alt={badge.alt}
    loading="lazy"
/>

<style>
    img {
        height: var(--chat-font-size);
        width: var(--chat-font-size);
        object-fit: contain;
    }
</style>
