<script lang="ts">
    let leftWidth = $state(280); // px
    let isDragging = $state(false);
    let containerRef: HTMLDivElement;

    function startDrag(e: PointerEvent) {
        isDragging = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onDrag(e: PointerEvent) {
        if (!isDragging || !containerRef) return;
        const rect = containerRef.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        leftWidth = newWidth; // clamp min/max
    }

    function stopDrag() {
        isDragging = false;
    }
</script>

<div class="split-container" bind:this={containerRef}>
    <div class="panel-left" style="width: {leftWidth}px">
        <!-- your channel list / sidebar content -->
    </div>

    <div
        class="resize-handle"
        class:dragging={isDragging}
        onpointerdown={startDrag}
        onpointermove={onDrag}
        onpointerup={stopDrag}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftWidth}
        aria-valuemin={150}
        aria-valuemax={600}
        tabindex="0"
    >
        <span class="handle-icon">↔</span>
    </div>

    <div class="panel-right">
        <!-- your main chat / video content -->
    </div>
</div>

<style>
    .split-container {
        display: flex;
        height: 100%;
        width: 100%;
    }

    .panel-left {
        flex-shrink: 0;
        overflow-y: auto;
        background-color: red;
    }

    .panel-right {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        background-color: blue;
    }

    .resize-handle {
        width: 6px;
        flex-shrink: 0;
        cursor: col-resize;
        background: transparent;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: none;
    }

    .resize-handle:hover,
    .resize-handle.dragging {
        background: rgba(255, 255, 255, 0.1);
    }

    .handle-icon {
        opacity: 0;
        font-size: 12px;
        color: #888;
        transition: opacity 0.15s;
        pointer-events: none;
    }

    .resize-handle:hover .handle-icon,
    .resize-handle.dragging .handle-icon {
        opacity: 1;
    }
</style>
