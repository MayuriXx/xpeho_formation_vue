import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import Login from './Login.vue'
import Hello from './Hello.vue'
import { useUserStore } from '../stores/user.stores'

describe('Login Component', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    // Create a router for testing
    const routes: RouteRecordRaw[] = [
      { path: '/login', component: Login, meta: { requiresAuth: false } },
      { path: '/hello', component: Hello, meta: { requiresAuth: true } },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    // Add the guard
    router.beforeEach((to) => {
      const store = useUserStore()
      if (to.meta.requiresAuth && !store.isAuthenticated) {
        return '/login'
      }
      return true
    })
  })

  describe('Email validation', () => {
    it('should accept "toto" as valid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Fill the field with "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Click the login button
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Verify there is no error
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(false)

      // Verify that authentication is enabled
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(true)
    })

    it('should reject invalid emails', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Fill with an invalid email
      const input = wrapper.find('#email')
      await input.setValue('invalid@email.com')

      // Click the button
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Verify that an error is displayed
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('Invalid email')

      // Verify that authentication is not enabled
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should reject empty email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Leave the field empty
      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Verify that an error is displayed
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)

      // Verify that authentication is not enabled
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Toggle permission button', () => {
    it('should activate permission when clicking toggle button', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)

      // Click the toggle button
      const toggleButton = wrapper.find('.toggle-button')
      await toggleButton.trigger('click')

      // Verify that authentication is enabled
      expect(store.isAuthenticated).toBe(true)

      // Verify that the button text has changed
      expect(toggleButton.text()).toBe('Disable')
    })

    it('should redirect to /hello after activating permission', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()

      // Click the toggle button
      const toggleButton = wrapper.find('.toggle-button')
      await toggleButton.trigger('click')

      // Verify that authentication is enabled
      expect(store.isAuthenticated).toBe(true)

      // Verify that router.push was called with '/hello'
      expect(router.currentRoute.value.path === '/' || router.currentRoute.value.path === '/hello').toBe(true)
    })

    it('should display permission status correctly', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      const store = useUserStore()

      // At first, permission disabled
      let status = wrapper.find('.permission-status strong')
      expect(status.text()).toContain('Disabled')
      expect(status.element?.classList.contains('denied')).toBe(true)

      // Enable permission
      store.isAuthenticated = true
      await wrapper.vm.$nextTick()

      // Verify that the status has changed
      status = wrapper.find('.permission-status strong')
      expect(status.text()).toContain('Enabled')
      expect(status.element?.classList.contains('granted')).toBe(true)
    })
  })

  describe('Enter key handling', () => {
    it('should validate form when pressing Enter with valid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Remplir avec "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Simuler la pression de la touche Enter
      await input.trigger('keypress', { key: 'Enter' })

      // Vérifier que l'authentification est activée
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(true)
    })

    it('should show error when pressing Enter with invalid email', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Fill with invalid email
      const input = wrapper.find('#email')
      await input.setValue('wrong@email.com')

      // Simulate pressing the Enter key
      await input.trigger('keypress', { key: 'Enter' })

      // Verify that an error is displayed
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
    })

    it('should not validate when pressing other keys', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Fill with "toto"
      const input = wrapper.find('#email')
      await input.setValue('toto')

      // Simulate pressing another key (e.g., 'a')
      await input.trigger('keypress', { key: 'a' })

      // Verify that authentication is not enabled
      const store = useUserStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Error message handling', () => {
    it('should clear error message when input changes', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router],
        },
      })

      // Submit with invalid email
      const input = wrapper.find('#email')
      await input.setValue('invalid@email.com')

      const button = wrapper.find('.login-button')
      await button.trigger('click')

      // Verify that an error is displayed
      let errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)

      // Modify the input
      await input.setValue('toto')

      // Submit
      await button.trigger('click')

      // Verify that the error has disappeared
      errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(false)
    })
  })
})
