<script lang="ts">
    import { Coffee, Home, Info } from "@lucide/svelte";

    import MainDisplay from "./Main/Chat/Main.svelte";

    import HelpMain from "./Main/Help/Main.svelte";

    import MessageCreatorMain from "./Main/MessageCreator/Main.svelte";

    import { icon_size, isMobile } from "$stores/global";
    import Github from "./logos/github.svelte";

    let hash = window.location.hash;

    const onHashChange = () => (hash = window.location.hash);

    window.addEventListener("hashchange", onHashChange);

    $: console.log("Hash changed to", hash);
</script>

{#if hash.includes("help")}
    <HelpMain />
{:else if hash.includes("message-creator")}
    <MessageCreatorMain />
{:else}
    <MainDisplay />
{/if}

{#if $isMobile}
    <footer>
        <a href="/#">
            <Home size={$icon_size} /> Home
        </a>
        <a href="#help">
            <Info size={$icon_size} /> About
        </a>
        <a
            class="hide-on-small"
            href="https://github.com/Fiszh/UChat"
            target="_blank"
            rel="noopener noreferrer"
        >
            <Github /> GitHub
        </a>
        <a
            class="hide-on-small"
            href="https://buymeacoffee.com/jzlnkf5qgo"
            target="_blank"
            rel="noopener noreferrer"
        >
            <Coffee size={$icon_size} /> Support
        </a>
    </footer>
{/if}

<style lang="scss">
    @media (max-width: 768px) {
        footer {
            border-top: 1px #161616 solid;
            padding: 0.5rem 2rem;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            justify-content: space-evenly;

            font-size: 0.6rem;

            a {
                all: unset;
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
    @media (max-width: 320px) {
        footer .hide-on-small {
            display: none;
        }
    }
</style>
