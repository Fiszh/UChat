<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number; brandColor?: boolean } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2400 2800"
    width={size}
    height={size}
>
    <g fill={brandColor ? "#9146FF" : "currentColor"}>
        <path
            d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600V1300z"
        />

        <rect x="1700" y="550" width="200" height="600" />

        <rect x="1150" y="550" width="200" height="600" />
    </g>
</svg>
