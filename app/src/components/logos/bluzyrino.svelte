<!-- ORIGINAL LOGO: https://bluzyrino.com/ -->
<!-- MODIFIED BY: uniidev -->

<script lang="ts">
    let {
        size = 1.2 * 16,
        brandColor = false,
    }: { size?: number | string; brandColor?: boolean } = $props();

    const uid = $props.id();
    const maskId = `mask-${uid}`;
    const filterId = `filter-${uid}`;
    const gradId = `linear-gradient-${uid}`;
    const gradId2 = `linear-gradient-2-${uid}`;
</script>

<svg
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
>
    <defs>
        <mask
            id={maskId}
            width="229"
            height="255"
            x="14"
            y="0"
            maskUnits="userSpaceOnUse"
            style="mask-type:luminance"
        >
            <path
                fill="#fff"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M140 0c42 0 79.3 20.6 102.2 52.3l-52.4 52.4a55.2 55.2 0 0 0-93.5-10.1 54.8 54.8 0 0 0-9.7 46.5l.1.6a55.1 55.1 0 0 0 40 39.7h.3-.2a43 43 0 0 0 1 .2h-.1.1l.3.1h-.1.4-.3l.9.2h-.3.4-.1.3-.1a60.3 60.3 0 0 0 10 1.1h.8c16.3 0 31-7 41-18.3l.6-.7a55 55 0 0 0 2.3-2.8v-.2s.2 0 .2-.2l-.1.2a68 68 0 0 0 6-10l50.5 51a126.3 126.3 0 0 1-61.7 44h-.5.1l-1.2.4.8-.2a149 149 0 0 1-2.5.7l-.6.2h-.2l-.5.2h.3a87 87 0 0 1-1.4.3h-.1l-.5.2h-.3c-10.3 2.8-21 4.2-32.2 4.2h-1.2c-24.5-.3-47.3-7.4-66.5-19.7-14 16.7-25.2 21.3-49.3 22.2 19.4-16.5 19.9-35 10.8-60.7A125.8 125.8 0 0 1 140 0"
            />
        </mask>

        <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1="138.385"
            y1="141.273"
            x2="138.385"
            y2="327.76"
            gradientTransform="matrix(.5551 -.83178 1.34344 .81888 -232.883 82.8)"
        >
            <stop offset="0" stop-color="#071b4d" />
            <stop offset=".365" stop-color="#0b2b70" />
            <stop offset="1" stop-color="#020b25" />
        </linearGradient>

        <linearGradient
            id={gradId2}
            gradientUnits="userSpaceOnUse"
            x1="128.092"
            y1="0"
            x2="128.092"
            y2="179.7"
            gradientTransform="rotate(-63.46 148.287 32.231)scale(1 .77619)"
        >
            <stop offset="0" stop-color="#5bd3ff" />
            <stop offset=".52" stop-color="#1688ff" />
            <stop offset="1" stop-color="#0649c9" />
        </linearGradient>

        <filter
            id={filterId}
            width="260.2"
            height="221.7"
            x="-2"
            y="0"
            color-interpolation-filters="sRGB"
            filterUnits="userSpaceOnUse"
        >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="26" />
            <feGaussianBlur stdDeviation="8" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
            <feBlend in2="BackgroundImageFix" result="drop" />
            <feBlend in="SourceGraphic" in2="drop" result="shape" />
            <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha2"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dx="6" dy="6" />
            <feGaussianBlur stdDeviation="8" />
            <feComposite
                in2="hardAlpha2"
                k2="-1"
                k3="1"
                operator="arithmetic"
            />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
            <feBlend in2="shape" result="inner" />
        </filter>
    </defs>

    <g mask={`url(#${maskId})`}>
        <path
            fill={brandColor ? `url(#${gradId})` : "currentColor"}
            stroke={brandColor ? "#a9dcff" : undefined}
            stroke-width={brandColor ? 5 : undefined}
            stroke-miterlimit={brandColor ? "4.9" : undefined}
            paint-order={brandColor ? "fill stroke" : undefined}
            d="M57.4 99.9C93.2 64.1 145 57.6 174 84.7a55 55 0 1 0 16 66.3l50.6 51a125.8 125.8 0 0 1-168.2 30.3c-14 16.7-25.2 21.3-49.3 22.2 19.4-16.5 19.9-35 10.8-60.7-2.9-4.5-5.5-9.2-7.8-14-2.9-26.3 8-56.5 31.4-79.9Z"
        />
        <g filter={`url(#${filterId})`}>
            <path
                fill={brandColor ? `url(#${gradId2})` : "currentColor"}
                d="M140 0c42 0 79.3 20.6 102.2 52.3l-52.4 52.4a55.2 55.2 0 0 0-15.9-20C145 57.6 93.2 64.1 57.4 100 34 123.3 24 154 26 179.7A126 126 0 0 1 140 0"
            />
        </g>
        <path
            fill="#8fd5ff"
            d="M57 99.5C93 63.7 145 57 174.3 84.3l.3-.4h.1l-.3.5a55.7 55.7 0 0 1 16 20 .5.5 0 0 1-.9.6v-.1l-.4-.7c-3.6-7.5-8.9-14-15.4-19l-.3.3.3-.4-.3.3.3-.3c-28.8-26.9-80.2-20.5-115.8 15.2-23 22.9-33.8 55-31.4 81l.1 1.1v.1a.5.5 0 0 1-1 .2v-.1l-.1-1.3A107.3 107.3 0 0 1 57 99.5m116.3-14"
        />
    </g>
</svg>
