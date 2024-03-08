<script setup lang="js">
import { ElContainer, ElHeader, ElMain, ElFooter } from 'element-plus';
import AppCanvas from './AppCanvas.vue';

const year = new Date().getFullYear();
</script>

<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader class="container">
        <h1>Rich text on HTML5 Canvas with text-to-canvas</h1>
        <p>
          Render multiline plain or rich text into textboxes on HTML5 Canvas
          with automatic line wrapping, in the browser or in Node.
        </p>
        <p>
          Read the docs on
          <a href="https://github.com/stefcameron/text-to-canvas/">Github</a>.
        </p>
      </ElHeader>
      <ElMain class="container">
        <AppCanvas />
      </ElMain>
      <ElHeader class="container">
        <div class="flex">
          <div class="flex-1">
            <h2>Supports browsers, Web Workers, and Node</h2>
            <p
              >Works with all modern browsers, as well as Node with
              <code>node-canvas</code>.</p
            >
            <p>
              Also works with
              <a
                href="https://github.com/stefcameron/text-to-canvas?tab=readme-ov-file#web-worker-and-offscreencanvas"
                >Web Workers</a
              >
              and <code>OffscreenCanvas</code>.
            </p>
          </div>
          <div class="flex-1">
            <h2>Plain or rich text rendering</h2>
            <p>
              The main <code>drawText()</code>
              <a
                href="https://github.com/stefcameron/text-to-canvas?tab=readme-ov-file#api"
                >API</a
              >
              accepts either a plain string or an array of
              <code>Word</code> objects. Define your base formatting options and
              then use a string to render everything the same, or use
              <code>Word</code> objects to apply overrides to the base
              formatting as necessary.
            </p>
          </div>
        </div>
      </ElHeader>
      <ElFooter>
        <div class="footer-text">
          Copyright (c) {{ year }}
          <a href="https://stefancameron.com">Stefan Cameron</a> |
          <a href="https://github.com/stefcameron/text-to-canvas/">Github</a>
        </div>
      </ElFooter>
    </ElContainer>
  </div>
</template>

<style scoped>
.container {
  margin: 40px auto;
  max-width: 1200px;
}

@media all and (max-width: 1200px) {
  .container {
    margin: 40px 40px;
  }
}
.footer-text {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 40px;
}

.flex {
  display: flex;
  gap: 20px;
}

@media all and (max-width: 1200px) {
  .flex {
    flex-direction: column;
  }
}

.flex-1 {
  flex: 1;
}

.image {
  max-width: 100%;
}
</style>
