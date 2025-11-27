<script setup lang="js">
import { drawText, textToWords } from 'text-to-canvas';
import { ref, reactive, onMounted, watch } from 'vue';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

const canvas = ref(null);
const context = ref(null);

const fontFamilies = [
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Impact',
  'Inter',
  'Montserrat',
  'Roboto',
  'Times New Roman',
  'Verdana',
];

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
  underline: false,
  strikethrough: false,
  // ❗️ IMPORTANT: always initialize with a system font (one that is globally available on all
  //  systems); any non-system fonts added MUST ALSO BE DOWNLOADED and won't render properly
  //  initially if not previously installed -- add non-system fonts to INDEX.HTML Google Font
  //  API request
  fontFamily: 'Times New Roman',
  fontColor: 'slategray',
  underlineColor: 'blue',
  strikethroughColor: 'red',
  underlineThickness: 1,
  underlineOffset: 0,
  strikethroughOffset: 0,
  fontStyle: false,
  strokeColor: 'black',
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
    fontFamily: config.fontFamily,
    fontColor: config.fontColor,
    fontSize: config.fontSize,
    strokeWidth: config.strokeWidth,
    underline: config.underline
      ? {
          color: config.underlineColor,
          offset: config.underlineOffset,
          thickness: config.underlineThickness,
        }
      : false,
    strikethrough: config.strikethrough
      ? {
          color: config.strikethroughColor,
          offset: config.strikethroughOffset,
        }
      : false,
    // currently not configurable in demo UI
    fontWeight: '400',
    strokeColor: config.strokeColor,
  };

  const words = textToWords(config.text);

  if (config.fontStyle) {
    words.forEach((word) => {
      word.format = { ...(word.format || {}), fontStyle: 'italic' };
    });
  }

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
        <div class="wrapper">
          <div class="dropdown">
            <span class="label">Font</span>
            <el-select
              v-model="config.fontFamily"
              placeholder="Select font"
              size="medium"
            >
              <el-option
                v-for="font in [...fontFamilies].sort()"
                :key="font"
                :label="font"
                :value="font"
              />
            </el-select>
          </div>

          <div class="inline-option">
            <span class="label">Color</span>
            <input
              type="color"
              v-model="config.fontColor"
              class="color-input"
            />
          </div>
        </div>

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

        <el-row :gutter="12" class="align-row">
          <el-col :span="12">
            <el-form-item label="Horizontal Align" class="align-item">
              <el-select v-model="config.align" placeholder="Align">
                <el-option label="Center" value="center" />
                <el-option label="Left" value="left" />
                <el-option label="Right" value="right" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Vertical Align" class="align-item">
              <el-select v-model="config.vAlign" placeholder="vAlign">
                <el-option label="Middle" value="middle" />
                <el-option label="Top" value="top" />
                <el-option label="Bottom" value="bottom" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="checkbox-section">
          <el-checkbox v-model="config.justify" label="Justify" />
          <el-checkbox v-model="config.fontStyle" label="Italic" />
          <div class="checkbox-with-options">
            <div class="checkbox-line">
              <el-checkbox v-model="config.underline" label="Underline" />
              <div v-if="config.underline" class="inline-options underline">
                <div class="inline-option">
                  <span class="option-label">Offset</span>
                  <el-input-number
                    v-model="config.underlineOffset"
                    :min="-20"
                    :max="50"
                    :step="1"
                    size="small"
                    controls-position="right"
                  />
                </div>
                <div class="inline-option">
                  <span class="option-label">Thickness</span>
                  <el-input-number
                    v-model="config.underlineThickness"
                    :min="1"
                    :max="10"
                    :step="1"
                    size="small"
                    controls-position="right"
                  />
                </div>
                <div class="inline-option">
                  <span class="option-label">Color</span>
                  <input
                    type="color"
                    v-model="config.underlineColor"
                    placeholder="red"
                    class="color-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="checkbox-with-options">
            <div class="checkbox-line">
              <el-checkbox
                v-model="config.strikethrough"
                label="Strikethrough"
              />

              <div v-if="config.strikethrough" class="inline-options">
                <div class="inline-option">
                  <span class="option-label">Offset</span>
                  <el-input-number
                    v-model="config.strikethroughOffset"
                    :min="-20"
                    :max="50"
                    :step="1"
                    size="small"
                    controls-position="right"
                  />
                </div>
                <div class="inline-option">
                  <span class="option-label">Color</span>
                  <input
                    type="color"
                    v-model="config.strikethroughColor"
                    class="color-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
.align-row {
  display: flex;
}

.align-item {
  display: flex;
  flex-direction: column;
}

.align-item .el-form-item__label {
  text-align: left;
  margin-bottom: 8px;
}
.checkbox-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
}

.checkbox-with-options {
  display: flex;
  flex-direction: column;
}

.checkbox-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.inline-options {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.inline-option {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-input {
  width: 80px;
  height: 32px;
  padding: 1px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.3s;
}

.color-input:focus {
  border-color: #409eff;
  outline: none;
}

.option-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  min-width: 40px;
}

.slider,
.dropdown {
  display: flex;
  align-items: center;
}

.slider .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider .label,
.dropdown .label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.slider .label + .el-slider,
.dropdown .label + .el-select {
  flex: 0 0 85%;
}

.flex {
  display: flex;
}

@media all and (max-width: 900px) {
  .flex {
    flex-direction: column;
  }

  .inline-options {
    flex-direction: column;
    gap: 8px;
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }

  .checkbox-line {
    flex-direction: column;
    align-items: flex-start;
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
.wrapper {
  display: flex;
  gap: 16px;
  margin: 10px 0;
}

.wrapper .dropdown {
  flex: 1;
}

.canvas-wrapper {
  position: sticky;
  top: 20px;
  height: fit-content;
}
</style>
