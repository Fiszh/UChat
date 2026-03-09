<script>
    function goBack() {
        history.back();
    }
</script>

<main>
    <div>
        <h1>Oops, page not found</h1>
        <p>
            Looks like the page you're trying to reach doesn't exist or was
            moved. <br />
            Check the URL or try one of the options below.
        </p>
        <div id="buttons">
            <button on:click={goBack}>Go back a page</button>
            <a href="/">Go back homepage</a>
        </div>
    </div>
    <img src="https://cdn.unii.dev/404.avif" alt="404" />
</main>

<style lang="scss">
    main {
        width: 100dvw;
        height: 100dvh;
        display: flex;
        padding: 50px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(45deg, #080808, #0d0d10);
    }
    h1 {
        font-size: 2.5rem;
    }

    p {
        width: 40dvw;
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

    img {
        aspect-ratio: 1 / 1;
        height: 20dvw;
        border-radius: 10px;
    }

    @media (max-width: 768px) {
        main {
            padding: 25px;
            flex-direction: column;
            justify-content: center;
            gap: 3rem;
            text-align: center;
        }

        h1 {
            font-size: 2rem;
        }

        img {
            height: 60dvw;
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
