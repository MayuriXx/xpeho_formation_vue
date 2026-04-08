import { ref, onMounted, onUnmounted } from 'vue'

// par convention, les noms de fonctions composables commencent par "use"
export function useMouse() {
  // état encapsulé et géré par le composable
  const x = ref(0)
  const y = ref(0)

  // un composable peut mettre à jour son état géré au fil du temps.
  function update(event: any) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // un composable peut également s'accrocher au cycle de vie de son composant
  // propriétaire pour configurer et démonter les effets de bord.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose l'état géré comme valeur de retour
  return { x, y }
}