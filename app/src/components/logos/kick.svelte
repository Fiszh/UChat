<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number; brandColor?: boolean } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 453.9 510.6"
    width={size}
    height={size}
>
    <path
        d="M0,0h170.2v113.5h56.7v-56.7h56.7V0h170.2v170.2h-56.7v56.7h-56.7v56.7h56.7v56.7h56.7v170.2h-170.2v-56.7h-56.7v-56.7h-56.7v113.5H0V0Z"
        fill={brandColor ? "#53fc18" : "currentColor"}
    />
</svg>
