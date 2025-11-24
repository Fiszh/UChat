<script lang="ts">
  import Sidebar from "./Main/Sidebar.svelte";
  import MainDisplay from "./Main/Chat/Main.svelte";


</script>

<main>
  <Sidebar />
  <MainDisplay />
</main>

<style lang="scss">
  main {
    display: flex;
    
    background: linear-gradient(#080808, #000000);
  }
</style>
