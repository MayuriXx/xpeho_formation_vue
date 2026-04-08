import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { mount } from '@vue/test-utils'
import { useUserStore } from '../stores/user.stores'
import Login from '../components/Login.vue'
import Hello from '../components/Hello.vue'

/**
 * Feature: Authentication
 * As a user
 * I want to log in with a valid email
 * So that I can access the application
 */

describe('Feature: User Authentication', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    const routes: RouteRecordRaw[] = [
      { path: '/login', component: Login, meta: { requiresAuth: false } },
      { path: '/hello', component: Hello, meta: { requiresAuth: true } },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.beforeEach((to) => {
      const store = useUserStore()
      if (to.meta.requiresAuth && !store.isAuthenticated) {
        return '/login'
      }
      return true
    })
  })

  /**
   * Scenario: User logs in with valid email "toto"
   * Given I am on the login page
   * When I enter "toto" as email
   * And I click the login button
   * Then I should be redirected to the Hello page
   * And my authentication status should be active
   */
  it('Scenario: User logs in with valid email', async () => {
    // Given I am on the login page
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })

    // When I enter "toto" as email
    const input = wrapper.find('#email')
    await input.setValue('toto')

    // And I click the login button
    const button = wrapper.find('.login-button')
    await button.trigger('click')

    // Then authentication status should be active
    const store = useUserStore()
    expect(store.isAuthenticated).toBe(true)

    // And error message should not appear
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(false)
  })

  /**
   * Scenario: User cannot access protected page without login
   * Given I am not authenticated
   * When I try to access the Hello page
   * Then I should be redirected to the login page
   */
  it('Scenario: User cannot access protected page without login', async () => {
    // Given I am not authenticated
    const store = useUserStore()
    expect(store.isAuthenticated).toBe(false)

    // When I try to access the Hello page
    await router.push('/hello')

    // Then I should be redirected to the login page
    expect(router.currentRoute.value.path).toBe('/login')
  })

  /**
   * Scenario: User sees error with invalid email
   * Given I am on the login page
   * When I enter "invalid@email.com" as email
   * And I click the login button
   * Then an error message should appear
   * And I should remain on the login page
   */
  it('Scenario: User sees error with invalid email', async () => {
    // Given I am on the login page
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    await router.push('/login')

    // When I enter "invalid@email.com" as email
    const input = wrapper.find('#email')
    await input.setValue('invalid@email.com')

    // And I click the login button
    const button = wrapper.find('.login-button')
    await button.trigger('click')

    // Then an error message should appear
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('Invalid email')

    // And I should remain on the login page
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
