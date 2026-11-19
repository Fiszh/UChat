<!-- ORIGINAL LOGO: https://enhancer.at/ -->
<!-- SVG CREATED AND MODIFIED BY: uniidev -->

<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number | string; brandColor?: boolean } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="32 32 64 64"
    width={size}
    height={size}
    fill={brandColor ? "#9147ff" : "currentColor"}
>
    <path
        fill-rule="evenodd"
        d="M96 74V64a32 32 0 1 0-32 32h9.8V86H64a22 22 0 1 1 22-22v10Z"
    />
    <circle cx="64.4" cy="63.7" r="7.5" />
    <path d="M96 81.8h-5.51a31.75 31.75 0 0 1-8.99 8.99V96H96Z" />
</svg>
