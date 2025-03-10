<script setup lang="js">
import { drawText, textToWords } from 'text-to-canvas';
import { ref, reactive, onMounted, watch } from 'vue';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

const canvas = ref(null);
const context = ref(null);

const renderTime = ref(0);

const canvasSize = { w: 500, h: 500 };

const initialConfig = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin convallis eros.',
  pos: { x: 100, y: 150 },
  size: { w: 300, h: 200 },
  fontSize: 24,
  strokeWidth: 0,
  align: 'center',
  vAlign: 'middle',
  justify: false,
  debug: false,
  overflow: true,
};

const config = reactive(cloneDeep(initialConfig));

function resetConfig() {
  for (const key of Object.keys(initialConfig)) {
    if (key in config) {
      config[key] =
        typeof initialConfig[key] === 'object'
          ? cloneDeep(initialConfig[key])
          : initialConfig[key];
    }
  }
}

function renderText() {
  if (!context.value) {
    return;
  }

  const ctx = context.value;

  ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

  const myConfig = {
    x: config.pos.x,
    y: config.pos.y,
    width: config.size.w,
    height: config.size.h,
    align: config.align,
    vAlign: config.vAlign,
    justify: config.justify,
    debug: config.debug,
    overflow: config.overflow,
    // currently not configurable in demo UI
    fontFamily: 'Times New Roman, serif',
    fontSize: config.fontSize,
    fontWeight: '400',
    fontColor: 'slategray',
    strokeWidth: config.strokeWidth,
    strokeColor: 'lime',
  };

  const words = textToWords(config.text);
  words.forEach((word) => {
    if (word.text === 'ipsum') {
      word.format = { fontStyle: 'italic', fontColor: 'red' };
    } else if (word.text === 'consectetur') {
      word.format = {
        fontWeight: 'bold',
        fontColor: 'blue',
        strokeColor: 'cyan',
        strokeWidth: 0.5,
      };
    }
  });

  const { height } = drawText(ctx, words, myConfig);

  // eslint-disable-next-line no-console
  console.log(`Total height = ${height}`);
}

function redrawAndMeasure() {
  const t0 = performance.now();
  renderText();
  const t1 = performance.now();
  renderTime.value = t1 - t0;

  // eslint-disable-next-line no-console
  console.log(`Rendering took ${renderTime.value} milliseconds`);
}
const debouncedRedrawAndMeasure = debounce(redrawAndMeasure, 10);

function initializeCanvas() {
  context.value = canvas.value.getContext('2d');

  debouncedRedrawAndMeasure();
}

watch(config, () => {
  debouncedRedrawAndMeasure();
});

onMounted(() => {
  initializeCanvas();
});
</script>

<template>
  <div>
    <div class="flex">
      <div class="canvas-wrapper">
        <canvas width="500" height="500" ref="canvas" />
      </div>
      <div class="controls-wrapper">
        <el-input
          v-model="config.text"
          :rows="2"
          type="textarea"
          placeholder="Please input"
        />
        <p>
          💬 To keep the demo app simple while showing the library's rich text
          features, the word "ipsum" is always rendered in italics/red without a
          stroke, and the word "consectetur" always in bold/blue with a cyan
          stroke fixed at 0.5px.
        </p>
        <p>
          🔺 Setting the <code>Stroke</code> too large will cause it to bleed
          out of the box. <strong>This is expected</strong>, and a limitation of
          using the <code>strokeText()</code> Canvas API to stroke the text. The
          stroke is always drawn on the center of the edges, and is not
          considered by the <code>measureText()</code> Canvas API.
        </p>
        <p>
          Turn on <strong>debug mode</strong> (below) to see the text box
          boundaries.
        </p>
        <div class="slider">
          <span class="label">Font size</span>
          <el-slider
            v-model="config.fontSize"
            show-input
            :min="0"
            :max="128"
            size="small"
          />
        </div>
        <div class="slider">
          <span class="label">Stroke 🔺</span>
          <el-slider
            v-model="config.strokeWidth"
            show-input
            :min="0"
            :max="20"
            :step="0.5"
            size="small"
          />
        </div>
        <div class="slider">
          <span class="label">Pos X</span>
          <el-slider
            v-model="config.pos.x"
            show-input
            :min="0"
            :max="500"
            size="small"
          />
        </div>
        <div class="slider">
          <span class="label">Pos y</span>
          <el-slider
            v-model="config.pos.y"
            show-input
            :min="0"
            :max="500"
            size="small"
          />
        </div>
        <div class="slider">
          <span class="label">Width</span>
          <el-slider
            v-model="config.size.w"
            show-input
            :min="0"
            :max="500"
            size="small"
          />
        </div>
        <div class="slider">
          <span class="label">Height</span>
          <el-slider
            v-model="config.size.h"
            show-input
            :min="0"
            :max="500"
            size="small"
          />
        </div>

        <br />
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="Horizontal Align">
              <el-select v-model="config.align" placeholder="Align">
                <el-option label="Center" value="center" />
                <el-option label="Left" value="left" />
                <el-option label="Right" value="right" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vertical Align">
              <el-select v-model="config.vAlign" placeholder="vAlign">
                <el-option label="Middle" value="middle" />
                <el-option label="Top" value="top" />
                <el-option label="Bottom" value="bottom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="config.justify" label="Justify" />
          </el-col>
        </el-row>
        <br />

        <el-row :gutter="12">
          <el-col :span="12">
            <el-checkbox v-model="config.overflow" label="Overflow" />
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="config.debug" label="Debug mode" />
          </el-col>
        </el-row>

        <br />
        <ElButton @click="resetConfig">Reset</ElButton>
      </div>
    </div>
    <div class="bottom-text">
      Last render took {{ renderTime }} milliseconds.
      <br />
      You will notice a delay after you change a control, this is because the
      render function is
      <a
        href="https://www.geeksforgeeks.org/debouncing-in-javascript/"
        target="_blank"
        >debounced</a
      >.
    </div>
  </div>
</template>

<style scoped>
canvas {
  background-color: #e7e6e8;
  max-width: 100%;
}

.slider {
  display: flex;
  align-items: center;
}
.slider .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider .label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider .label + .el-slider {
  flex: 0 0 85%;
}

.flex {
  display: flex;
}

@media all and (max-width: 900px) {
  .flex {
    flex-direction: column;
  }
}

.flex > div {
  flex: 1;
}

.canvas-wrapper {
  margin: 20px auto;
}

.controls-wrapper {
  margin: 20px auto;
  margin-left: 12px;
}

.bottom-text {
  font-size: 0.8em;
  color: #e7e6e8;
}
</style>
