<script lang="ts">
    import { dev } from "$app/env";
</script>

{__APP_VERSION}
{dev ? "DEV" : ""}
{__DEBUG__ ? "DEBUG" : ""}
