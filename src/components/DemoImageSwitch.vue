<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { imageList } from '../utils/image'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  modelValue: string
  images?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { isEn } = useLocale()
const images = computed(() => (props.images?.length ? props.images : imageList))

watchEffect(() => {
  if (props.modelValue) return
  if (!images.value.length) return
  // 随机选择一张图片
  emit('update:modelValue', images.value[Math.floor(Math.random() * images.value.length)])
})

const value = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

const labels = computed(() =>
  isEn.value
    ? {
        title: 'Image',
        random: 'Random',
      }
    : {
        title: '图片',
        random: '随机',
      },
)

const pickRandom = () => {
  if (!images.value.length) return
  const next = images.value[Math.floor(Math.random() * images.value.length)]
  emit('update:modelValue', next)
}
</script>

<template>
  <section class="demo-image-switch">
    <span class="label">{{ labels.title }}</span>
    <el-select v-model="value" class="select" :teleported="false">
      <el-option
        v-for="(item, index) in images"
        :key="item"
        :label="`#${index + 1}`"
        :value="item"
      />
    </el-select>
    <el-button @click="pickRandom">{{ labels.random }}</el-button>
  </section>
</template>

<style scoped lang="scss">
.demo-image-switch {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 0;
}

.label {
  color: #666;
}

.select {
  width: 260px;
}
</style>
