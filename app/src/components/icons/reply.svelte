<script lang="ts">
    let { size = 1.2 * 16 }: { size?: number | string } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 200"
    width={size}
    height={Number(size) / 2}
>
    <path
        d="M44 190c0-87 58-127 146-127h200"
        fill="none"
        stroke="#fff"
        stroke-width="15"
        stroke-linecap="round"
    />
</svg>
