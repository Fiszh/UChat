<script>
    import ColorPicker from "$components/colorPicker.svelte";

    let color = $state("#8000ff");
    let hue = $state(0);
    let brightness = $state(1);
    let saturation = $state(100);
</script>

<ColorPicker bind:color bind:hue bind:brightness bind:saturation></ColorPicker>

<span style="background-color: {color};"></span>

c:{color}
h:{hue}
b:{brightness}
s:{saturation}

<style>
    span {
        width: 1rem;
        height: 1rem;
    }
</style>
