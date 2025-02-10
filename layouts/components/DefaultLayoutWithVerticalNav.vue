<script lang="ts" setup>
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const empName = ref('')
const empId = ref('')

// Function to update local storage
const updateLocalStorage = () => {
  try {
    localStorage.setItem('employeeName', empName.value)
    localStorage.setItem('employeeId', empId.value)
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Function to sync state with localStorage
const syncStateFromLocalStorage = () => {
  empName.value = localStorage.getItem('employeeName') || ''
  empId.value = localStorage.getItem('employeeId') || ''
}

onMounted(() => {
  // Sync initial values from localStorage or route
  const route = useRoute()
  empName.value = route.query.employeeName || localStorage.getItem('employeeName') || ''
  empId.value = route.query.employeeId || localStorage.getItem('employeeId') || ''
  
  // Listen to localStorage changes
  window.addEventListener('storage', syncStateFromLocalStorage)
})

// Watch empName and empId and update localStorage if they change
watch([empName, empId], () => {
  updateLocalStorage()
})

onBeforeUnmount(() => {
  // Clean up listener when component is destroyed
  window.removeEventListener('storage', syncStateFromLocalStorage)
})

// Example function to set values (you can call this when you want to update)
const setEmployeeDetails = (name, id) => {
  empName.value = name
  empId.value = id
  updateLocalStorage() // Update local storage whenever you set new values
}
</script>



<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center prof">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <!-- <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn> -->

        <VSpacer />
        <div class="px-4 font-bold py-1 text-sm">
          <div>{{ empName || '' }}</div>
          <div>{{ empId || '' }}</div>
        </div>
        <UserProfile />
      </div>
    </template>

    <!-- <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <NuxtLink
        to="/"
        class="app-logo app-title-wrapper"
      >
        <v-img
          :width="207"
          aspect-ratio="16/9"
          cover
          src="https://powerstocks.gwcindia.in/Img/Power%20Stocks%20Logo%20Final%20Feb%202024%201.jpg"
        ></v-img>
      </NuxtLink>

      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template> -->

    <!-- <template #vertical-nav-content>
      <NavItems />
    </template> -->

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25 rem;
}

.prof {
  z-index: 1000;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
