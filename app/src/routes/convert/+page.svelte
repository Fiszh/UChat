<script lang="ts">
</script>

<h1>UChat URL Converter</h1>
<h2>Enter your old URL below:</h2>
<input type="text" id="oldUrl" placeholder="Input Invalid URL" />
<button id="convertButton">Convert</button>

<style lang="scss">
    %hover {
        background: #ffffff1c;
        border: 1px #3e3e3e solid;
        border-radius: 7px;
    }

    :global(body) {
        display: flex !important;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
        gap: 2rem;
    }

    h1 {
        margin: 0;
        font-size: 5rem;
    }

    h2 {
        margin: 0;
        font-size: 3rem;
    }

    button,
    input {
        all: unset;
        min-width: 20dvw;
        width: 0dvw;
        height: 5%;
        font-size: 2rem;
        text-align: center;
        background: #ffffff0f;
        border-radius: 10px;
        border: 1px #333 solid;
        transition: all 0.5s ease;

        &:hover {
            @extend %hover;
        }
    }

    input {
        min-width: 30dvw;
        width: 30dvw;
        box-sizing: border-box;
        overflow-x: auto;
        white-space: nowrap;

        &:hover,
        &:focus {
            @extend %hover;
            
            min-width: 33dvw;
            border-radius: 7px;
        }
    }

    button:hover {
        min-width: 23dvw;
        cursor: pointer;
    }
</style>
