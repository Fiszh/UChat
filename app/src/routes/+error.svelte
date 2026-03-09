<script>
    function goBack() {
        history.back();
    }
</script>

<main>
    <div class="container">
        <h1 class="AUUU">404</h1>
        <h1>Oops, page not found</h1>
        <p>
            Looks like the page you're trying to reach doesn't exist or was
            moved. <br />
            Check the URL or try one of the options below.
        </p>
        
        <div id="buttons">
            <a href="javascript:history.back()" class="button">Go Back a Page</a>
            <a href="/" class="button">Go back homepage</a>
        </div>

        <div class="gif">
            <img src="https://cdn.unii.dev/404.avif" alt="404" />
        </div>
    </div>
</main>

<style lang="scss">
    main {
        margin: 0;
        background: linear-gradient(45deg, #080808, #0d0d10);
        font-family: sans-serif;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .container {
        text-align: center;
    }

    h1 {
        font-size: 50px;
        margin: 30px 15px;
    }

    .AUUU {
        font-size: 100px;
        margin: 0;
    }

    p {
        margin: 15px 25px;
    }

    .button {
        display: inline-block;
        padding: 12px 28px;
        margin: 10px 5px;
        background: #232324;
        color: white;
        font-weight: 600;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-3px);
        }

        &:active {
            transform: translateY(1px);
        }
    }

    img {
        margin-top: 25px;
        width: 200px;
    }
</style>
