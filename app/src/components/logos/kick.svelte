<!-- Taken from the 7TV Repo: https://github.com/SevenTV/SevenTV/blob/main/apps/website/src/components/icons/kick-logo.svelte -->

<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number; brandColor?: boolean } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
>
    <path
        d="M64 464V48H192V144H272V96H320V48H448V176H400V224H352V288H400V336H441V464H313V416H264.5V368H200V464H64Z"
        fill={brandColor ? "#00E701" : "currentColor"}
    />
</svg>
