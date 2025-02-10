<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive data for employee name and ID
const empName = ref('');
const empId = ref('');

// Function to update localStorage with current employee data
const updateLocalStorage = () => {
  try {
    localStorage.setItem('employeeName', empName.value);
    localStorage.setItem('employeeId', empId.value);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Function to sync state with localStorage
const syncStateFromLocalStorage = () => {
  empName.value = localStorage.getItem('employeeName') || '';
  empId.value = localStorage.getItem('employeeId') || '';
};

// Sync data when component is mounted
onMounted(() => {
  const route = useRoute();
  empName.value = route.query.employeeName || localStorage.getItem('employeeName') || '';
  empId.value = route.query.employeeId || localStorage.getItem('employeeId') || '';

  // Listen for localStorage changes across tabs
  window.addEventListener('storage', syncStateFromLocalStorage);
});

// Watch for changes in empName or empId and update localStorage
watch([empName, empId], () => {
  updateLocalStorage();
});

// Cleanup event listener when component is destroyed
onBeforeUnmount(() => {
  window.removeEventListener('storage', syncStateFromLocalStorage);
});

// Logout function
const routeCheck = () => {
  // Clear user data from localStorage
  localStorage.removeItem('employeeName');
  localStorage.removeItem('employeeId');
  window.location.reload()
  // Redirect to login page
  // router.push('/login');
};

</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />
      
      <!-- User Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">{{ empName || 'UNKNOWN' }} </VListItemTitle>
            <VListItemSubtitle>{{ empId || '' }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- Logout Button -->
          <VListItem @click="routeCheck">
            <template #prepend>
              <VIcon class="me-2" icon="ri-logout-box-r-line" size="22" />
            </template>
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- End User Menu -->
    </VAvatar>
  </VBadge>
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
