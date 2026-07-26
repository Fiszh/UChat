<script lang="ts" module>
    import type { Snippet } from "svelte";
    import SevenTVComponent from "$components/logos/7tv.svelte";
    import BTTVComponent from "$components/logos/bttv.svelte";
    import ChatterinoHomiesComponent from "$components/logos/chatterino-homies.svelte";
    import ChatterinoComponent from "$components/logos/chatterino.svelte";
    import FFZComponent from "$components/logos/ffz.svelte";
    import GitHubComponent from "$components/logos/github.svelte";
    import KickComponent from "$components/logos/kick.svelte";
    import PolandBotComponent from "$components/logos/polandbot.svelte";
    import TurtegComponent from "$components/logos/turteg.svelte";
    import TwitchComponent from "$components/logos/twitch.svelte";
    import UChatComponent from "$components/logos/uchat.svelte";
    import YouTubeComponent from "$components/logos/youtube.svelte";

    export const logos: Record<string, Snippet<[boolean]>> = {
        "7tv": SevenTV,
        bttv: BTTV,
        "chatterino-homies": ChatterinoHomies,
        chatterino: Chatterino,
        ffz: FFZ,
        github: GitHub,
        kick: Kick,
        polandbot: PolandBot,
        turteg: Turteg,
        twitch: Twitch,
        uchat: UChat,
        youtube: YouTube,
    };
</script>

{#snippet SevenTV(brandColor: boolean)}<SevenTVComponent
        {brandColor}
    />{/snippet}
{#snippet BTTV(brandColor: boolean)}<BTTVComponent {brandColor} />{/snippet}
{#snippet ChatterinoHomies(brandColor: boolean)}<ChatterinoHomiesComponent
        {brandColor}
    />{/snippet}
{#snippet Chatterino(brandColor: boolean)}<ChatterinoComponent
        {brandColor}
    />{/snippet}
{#snippet FFZ(brandColor: boolean)}<FFZComponent {brandColor} />{/snippet}
{#snippet GitHub(brandColor: boolean)}<GitHubComponent {brandColor} />{/snippet}
{#snippet Kick(brandColor: boolean)}<KickComponent {brandColor} />{/snippet}
{#snippet PolandBot(brandColor: boolean)}<PolandBotComponent
        {brandColor}
    />{/snippet}
{#snippet Turteg(brandColor: boolean)}<TurtegComponent {brandColor} />{/snippet}
{#snippet Twitch(brandColor: boolean)}<TwitchComponent {brandColor} />{/snippet}
{#snippet UChat(brandColor: boolean)}<UChatComponent {brandColor} />{/snippet}
{#snippet YouTube(brandColor: boolean)}<YouTubeComponent
        {brandColor}
    />{/snippet}
