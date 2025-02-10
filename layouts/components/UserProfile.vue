<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

// Reactive data for employee name and ID
const empName = ref('')
const empId = ref('')

// Sync localStorage with component state
const updateLocalStorage = () => {
  try {
    localStorage.setItem('employeeName', empName.value)
    localStorage.setItem('employeeId', empId.value)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const syncStateFromLocalStorage = () => {
  empName.value = localStorage.getItem('employeeName') || ''
  empId.value = localStorage.getItem('employeeId') || ''
}

// Sync data when component is mounted
onMounted(() => {
  const route = useRoute()
  empName.value = route.query.employeeName || localStorage.getItem('employeeName') || ''
  empId.value = route.query.employeeId || localStorage.getItem('employeeId') || ''

  // Listen for localStorage changes across tabs
  window.addEventListener('storage', syncStateFromLocalStorage)
})

// Watch for changes in empName or empId and update localStorage
watch([empName, empId], () => {
  updateLocalStorage()
})

// Cleanup event listener when component is destroyed
onBeforeUnmount(() => {
  window.removeEventListener('storage', syncStateFromLocalStorage)
})

// Logout function
const routeCheck = () => {
  localStorage.removeItem('employeeName')
  localStorage.removeItem('employeeId')
  localStorage.removeItem('CustomerId')
  localStorage.removeItem('OrgName')
  window.location.reload()
}
</script>



<template>
  <div v-if="empName && empId">
    <!-- User Profile Menu -->
    <VBadge dot location="bottom right" color="success" bordered>
      <VAvatar class="cursor-pointer" color="primary" variant="tonal">
        <VImg :src="avatar1" />
        <VMenu activator="parent" width="230" location="bottom end" offset="14px">
          <VList>
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge dot location="bottom right" color="success">
                    <VAvatar color="primary" variant="tonal">
                      <VImg :src="avatar1" />
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>
              <VListItemTitle>{{ empName || 'UNKNOWN' }}</VListItemTitle>
              <VListItemSubtitle>{{ empId || 'No ID' }}</VListItemSubtitle>
            </VListItem>
            <VDivider class="my-2" />
            <VListItem @click="routeCheck">
              <template #prepend>
                <VIcon class="me-2" icon="ri-logout-box-r-line" size="22" />
              </template>
              <VListItemTitle>Logout</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VAvatar>
    </VBadge>
  </div>
  <div v-else>
    <p></p>
  </div>
</template>



<style lang="scss" scoped>
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
