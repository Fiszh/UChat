<script lang="ts">
    import { dev } from "$app/environment";
</script>

{__APP_VERSION}
{dev ? "DEV" : ""}
{__DEBUG__ ? "DEBUG" : ""}
