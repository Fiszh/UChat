<script lang="ts">
    import Dialog from "$components/Dialog.svelte";
    import { getPage, type PageCommit } from "$lib/services/github";

    let { showCommits = $bindable(false) } = $props();

    let commitDialog = $state<HTMLElement | null>(null);

    let loading = $state<Record<string, boolean>>({
        loading: false,
        failed: false,
        end: false,
        debounce: false,
    });

    let commits = $state<PageCommit[]>([]);

    $effect(() => {
        if (showCommits && !commits.length) loadCommits();

        if (loading.loading) {
            loading.debounce = true;
            setTimeout(() => {
                loading.debounce = false;
            }, 1000);
        }
    });

    async function loadCommits() {
        if (loading.loading || loading.debounce || loading.end) return;
        loading.loading = true;
        let childCount = commitDialog?.childNodes.length;

        if (typeof childCount == "number") {
            childCount -= 5; // REMOVE ON MOUNT CHILD COUNT

            const pages = Math.floor(childCount / 100) + 1;
            const start = Math.max(0, childCount % 100);
            const end = Math.min(100, start + 20);

            const pageCommits = await getPage(pages, start, end);

            if (!pageCommits) return (loading.failed = true);
            if (pageCommits.length < end - start) loading.end = true;

            commits = [...commits, ...pageCommits];
        }

        loading.loading = false;
    }

    async function scroll(e: Event) {
        const target = e.target as HTMLElement;

        if (target.scrollTop == target.scrollHeight - target.clientHeight)
            loadCommits();
    }
</script>

<Dialog name="Commits" bind:show={showCommits}>
    {#if loading.loading && !loading.failed}
        <p class="info">Loading...</p>
    {/if}
    {#if loading.failed}
        <section class="info failed">
            <p>LOADING FAILED!</p>
            <p>OPEN THE CONSOLE TO CHECK THE ISSUE</p>
        </section>
    {/if}
    <main bind:this={commitDialog} onscroll={scroll}>
        {#each commits as commit}
            <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                <p>
                    {@html commit.commit.message
                        .replace(/^(.+)/, '<span class="title">$1</span>')
                        .replace(/\n/g, "<br>")}
                </p>
                <p class="by">by: {commit.commit.author.name}</p>
            </a>
        {/each}
        {#if loading.end}
            <p class="center" id="end">end.</p>
        {/if}
    </main>
</Dialog>

<style lang="scss">
    p {
        margin: unset;
        padding-bottom: 0.75rem;
        padding-top: 0.25rem;

        &.center {
            text-align: center;
        }

        & > :global(.title) {
            border-left: 0.25rem solid #222222;
            border-radius: 0.25rem;
            padding-left: 0.25rem;
            font-weight: bold;
        }
    }

    #end {
        color: #555;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 8px 0;
    }

    .info {
        position: absolute;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        background-color: hsl(0, 0%, 8%);
        padding: 0.25rem 1rem;
        border: 1px solid #333;
        border-radius: 1rem;

        font-size: 1rem;
        font-weight: bolder;

        &.failed {
            font-size: 0.75rem;
            border-color: white;
            background-color: #e41f1f;
        }
    }

    main {
        overflow-y: auto;
        overflow-x: hidden;

        & > *:not(:last-child) {
            border-bottom: 0.15rem dashed #1b1b1b;
        }
    }

    a {
        color: white;
    }
</style>
