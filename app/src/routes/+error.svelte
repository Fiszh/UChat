<script lang="ts">
    import ChatDisplay from "$components/ChatDisplay.svelte";
    import { getBadges, sendFakeMessage } from "$lib/preview";
    import { emotes, isMobile } from "$stores/global";
    import { onDestroy, onMount } from "svelte";

    import SevenTV_main from "$lib/services/7TV/main";

    let loaded = $state(false);

    let chatRotation = $state({
        x: 0,
        y: 0,
    });

    const msgs = [
        "404 OMEGADANCE",
        "F",
        "chat where is the page PauseChamp",
        "bro the page is gone NOOOO",
        "404 Pepega",
        "who broke the site RAGEY",
        "COPIUM",
        "NOOOO",
        "the page is gone Sadge",
        "SadgeCry the page was right here",
        "@uniidev ur site is cooked bro",
        "have you tried turning it off and on again Nerd",
        "bro needs to learn nginx omE",
        "unban the page mods",
        "mods can we get the page back Prayge",
        "DIESOFCRINGE",
    ];

    let sendInterval: ReturnType<typeof setInterval>;

    onMount(async () => {
        loaded = true;

        getBadges();

        if (!$isMobile) {
            window.addEventListener("mousemove", (e) => {
                chatRotation.x = (e.pageY / window.innerHeight - 0.5) * 20;
                chatRotation.y = (e.pageX / window.innerWidth - 0.5) * -20;
            });
        }

        const previewEmotes = await SevenTV_main.emoteSet.bySetID(
            "01KQD6H6K5ZGDWX2RGM52J75Z5",
        );

        emotes.update((e) => ({
            ...e,
            "7TV": {
                ...e["7TV"],
                channel: {
                    ...e["7TV"].channel,
                    ["0"]: previewEmotes,
                },
            },
        }));

        sendInterval = setInterval(() => {
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            sendFakeMessage(msg);
        }, 1000);
    });

    onDestroy(() => clearInterval(sendInterval));

    const goBack = () => history.back();
</script>

<main style="--chat-x: {chatRotation.x}deg; --chat-y: {chatRotation.y}deg;">
    <div>
        <h1>Oops, page not found</h1>
        <p>
            Looks like the page you're trying to reach doesn't exist or was
            moved. <br />
            Check the URL or try one of the options below.
        </p>
        <div id="buttons">
            <button onclick={goBack}>Go back a page</button>
            <a href="/" data-sveltekit-preload-data="off">Go back homepage</a>
        </div>
    </div>

    {#if loaded}
        <section id="chat-display">
            <ChatDisplay />
            <p id="error">ERROR: channel not found</p>
            <div id="red-dot"></div>
        </section>
    {/if}
</main>

<style lang="scss">
    main {
        width: 97dvw;
        height: 100dvh;
        display: flex;
        padding: 50px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
    }

    h1 {
        font-size: 2.5rem;
    }

    #chat-display {
        display: flex;
        flex-direction: column;
        padding-inline: 0.5rem;
        padding-top: 0.5rem;
        height: 50%;
        width: 25%;

        :global(.chat) {
            height: 100% !important;
            padding: 0.2rem 0.4rem;
            box-sizing: border-box;
            position: relative !important;
        }

        #red-dot {
            position: absolute;
            background-color: rgb(255, 0, 0);
            aspect-ratio: 1/1;
            width: 1rem;
            border-radius: 1rem;
            right: -0.25rem;
            top: -0.25rem;

            animation: pulse 1s ease-in-out infinite;
        }

        user-select: none;

        #error {
            color: rgb(219, 63, 63);
            font-weight: bold;
            font-family: monospace;

            padding: 0.5rem 0.75rem;
            box-sizing: border-box;

            background-color: #ffffff07;
            border: 1px #ffffff0e solid;
            border-radius: 0.5rem;
        }

        min-height: 0;
        border-radius: 1rem;
        background-color: #5e5e5e0e;

        transform: perspective(1200px) rotateX(var(--chat-x))
            rotateY(var(--chat-y));
        box-shadow:
            0 1px 2px rgba(255, 255, 255, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.15),
            0 12px 24px rgba(0, 0, 0, 0.1);
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    #buttons {
        display: flex;
        gap: 25px;

        & > * {
            all: unset;
            transition: all 0.3s;
            padding: 0.75rem 2rem;
            background: rgba(255 255 255 / 0.1);
            border: 1px solid #555;
            border-radius: 12px;
            color: #eee;
            cursor: pointer;
            text-decoration: none;
            font-size: 1rem;

            &:hover {
                background-color: rgba(255, 255, 255, 0.068);
                border-radius: 10px;
                border: 1px white solid;
            }
        }
    }

    @media (max-width: 768px) {
        main {
            padding: 5rem 1.5rem;
            width: 100dvw;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5rem;
            text-align: center;
        }

        #chat-display {
            width: 95%;
            text-align: left;
            transform: perspective(75rem) rotateX(10deg) rotateY(-5deg);
        }

        h1 {
            font-size: 2rem;
        }

        p {
            width: 100%;
        }

        #buttons {
            justify-content: center;
            & > * {
                font-size: 1rem;
                padding: 0.5rem 1rem;
                border-radius: 7px;
            }
        }
    }
</style>
