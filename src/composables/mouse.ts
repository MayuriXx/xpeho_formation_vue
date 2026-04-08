import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useMouse() {
  // encapsulated state managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event: any) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into the lifecycle of its component
  // owner to set up and tear down side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose the managed state as a return value
  return { x, y }
}