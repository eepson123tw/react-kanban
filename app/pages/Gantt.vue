<script setup lang="ts">
import * as JSGantt from 'jsgantt-improved'

import { onMounted, ref } from 'vue'
import mockData from '~/constants/mock.json'

interface GanttOptions {
  vCaptionType: string
  vQuarterColWidth: number
  vDateTaskDisplayFormat: string
  vDayMajorDateDisplayFormat: string
  vWeekMinorDateDisplayFormat: string
  vLang: string
  vShowTaskInfoLink: number
  vShowEndWeekDate: number
  vAdditionalHeaders: Record<string, { title: string }>
  vUseSingleCell: number
  vFormatArr: string[]
  vScrollTo: Date
}

type GanttTask = typeof mockData.data[number] & { pGantt?: GanttOptions }

// Reference to the chart DOM element
const ganttChartRef = ref<HTMLElement | null>(null)
const contentJSON = ref({})
// Reference to the chart instance
let ganttChart: any = null

useAsyncData('gannt', async () => {
  contentJSON.value = mockData.data
  await Promise.resolve()
})
onMounted(() => {
  // Ensure the DOM element is available
  if (!ganttChartRef.value)
    return

  // Initialize the chart
  ganttChart = new JSGantt.GanttChart(ganttChartRef.value, 'day')

  // Configure the chart
  const options: GanttOptions = {
    vCaptionType: 'Complete',
    vQuarterColWidth: 36,
    vDateTaskDisplayFormat: 'day dd month yyyy',
    vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',
    vWeekMinorDateDisplayFormat: 'dd mon',
    vScrollTo: new Date(),
    vLang: 'en',
    vShowTaskInfoLink: 1,
    vShowEndWeekDate: 0,
    vAdditionalHeaders: {
    //   category: {
    //     title: 'Category',
    //   },
    //   sector: {
    //     title: 'Sector',
    //   },
    },
    vUseSingleCell: 10000,
    vFormatArr: ['Day', 'Week', 'Month', 'Quarter'],
  }

  ganttChart.setOptions(options)

  mockData.data.forEach((d: GanttTask) => {
    if (!d)
      return
    d.pGantt = ganttChart
    ganttChart.AddTaskItemObject(d)
  })
  ganttChart.Draw()
})

// Expose a method to refresh the chart if needed
function refreshChart() {
  if (ganttChart) {
    ganttChart.Draw()
  }
}

// Expose methods or data if needed
defineExpose({
  refreshChart,
})
</script>

<template>
  <div class="w-[1200px] flex flex-col gap-2 justify-center h-full m-auto">
    <div ref="ganttChartRef" style="position:relative" class="gantt-chart" />
    <div class="bg-gray-100 rounded-lg p-4 overflow-auto max-h-64 font-mono text-sm">
      <pre class="whitespace-pre-wrap">{{ contentJSON }}</pre>
    </div>
  </div>
</template>
