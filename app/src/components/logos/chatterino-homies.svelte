<!-- LOGO: Chatterino Homies https://chatterinohomies.com/ (fork of Chatterino: https://chatterino.com/) -->
<!-- SVG CREATED BY: https://www.twitch.tv/cascow_ -->
<!-- MODIFIED BY: uniidev -->

<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number | string; brandColor?: boolean } = $props();

    const uid = $props.id();
    const gradId = `linear-gradient-${uid}`;
    const gradId2 = `linear-gradient-2-${uid}`;
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 197.03 218.57"
    width={size}
    height={size}
>
    <defs>
        <linearGradient
            id={gradId}
            x1="16.97"
            y1="121.02"
            x2="16.97"
            y2="-43.94"
            gradientUnits="userSpaceOnUse"
        >
            <stop offset="0" stop-color="#f00586" />
            <stop offset="1" stop-color="#7e26c6" />
        </linearGradient>
        <linearGradient
            id={gradId2}
            x1="13.35"
            y1="59.46"
            x2="13.35"
            y2="-96.73"
            xlink:href={`#${gradId}`}
        />
    </defs>
    <g id="Layer_3" data-name="Layer 3">
        <path
            fill={brandColor ? `url(#${gradId})` : "currentColor"}
            d="M53.13-25.55S36.27-37.69,14.77-34.13c-26.45,4.39-39.32,31.4-37.93,46.45,2.06,22.45,10.58,45.81,44.9,46.84,31.6,1,45.16-26.71,45.16-26.71l43.62,43.87S88.1,122.75,20.06,121c-29.54-.78-56.25-18.45-56.25-18.45s-6.84,13.8-25.55,16.9c-3.55.59-14.84.9-14.84.9s11.81-12.17,13.68-17.16c2.27-6.07,1.24-19.46-.78-25.35-1.87-5.47-11.09-19.16-11.09-19.16l-1.29-40,7.35-17,36.65-37.55,27.35-5.41s28.65-2.59,29.16-2.59,24,8.78,24,8.78Z"
            transform="translate(85.16 97.55)"
        />
    </g>
    <g id="Layer_2" data-name="Layer 2">
        <path
            fill={brandColor ? `url(#${gradId2})` : "currentColor"}
            d="M67-8.32l44.9-44.9S80.52-97.15,27.1-97.54C-25-97.93-47-72-53.61-65.22-82.43-35.55-85.16-7.66-85.16,13.55c0,18.39,10.39,45.1,10.39,45.1s3.09-44.13,21.16-65.23C-33-30.61-20.32-37.14,6-39.67c16.06-1.55,27.68.38,37.74,6.84A71.05,71.05,0,0,1,67-8.32Z"
            transform="translate(85.16 97.55)"
        />
    </g>
</svg>
