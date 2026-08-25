<!-- ORIGINAL LOGO: https://pogly.gg -->
<!-- MODIFIED BY: uniidev -->

<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number | string; brandColor?: boolean } = $props();
</script>

<svg
    viewBox="0 0 42 40"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
>
    <path
        fill="#edf1ff"
        stroke="#edf1ff"
        d="M35.088.5h3.706v3.706h-3.706zM.5.5h3.706v3.706H.5z"
    />
    <path
        stroke="#edf1ff"
        fill="#00000000"
        d="M2.853 2.853h33.588v33.588H2.853z"
    />
    <path
        fill="#edf1ff"
        stroke="#edf1ff"
        d="M35.088 35.088h3.706v3.706h-3.706zm-34.588 0h3.706v3.706H.5z"
    />
    <path
        d="m13.65 10.914 25.589 9.35c1.077.393 1.046 1.928-.047 2.28L27.48 26.29 23.733 38c-.35 1.093-1.886 1.124-2.28.047l-9.348-25.589c-.351-.963.583-1.897 1.546-1.545"
        fill={brandColor ? "#82a5ff" : "currentColor"}
        stroke={brandColor ? "#82a5ff" : "currentColor"}
        stroke-opacity=".3"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
