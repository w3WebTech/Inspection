<template>
  <div>
    <div class="rounded-md shadow-md bg-white block md:hidden">
      <div
        v-if="esigntype === 'ap'"
        class="signature-section mb-4 px-3"
      >
        <h2 class="text-lg text-blue-900 font-medium my -2">Thank you for Esign Ap!!</h2>
        <h4 class="text-lg text-blue-900 font-medium my -2">Esign for Employeee</h4>
        <div class="border-dotted border-2 rounded h-40 relative my-4">
          <img
            src="public/download.jpg"
            class="absolute inset-0 w-full h-full object-cover p-4"
          />
        </div>
        <button
          class="bg-[#1E3A8A] hover:bg-[#1E3A8A] text-white font-bold py-2 my-3 rounded-md w-full"
          @click="submitSignature"
        >
          Proceed to Sign
        </button>
      </div>

      <div
        v-else-if="esigntype === 'emp'"
        class="p-5 py-10"
      >
        <div class="flex justify-center items0-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="green"
            class="h-20 w-20"
          >
            <path
              fill-rule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <!-- Thank You Message -->
        <p class="font-medium text-xl text-gray-800 flex justify-center pt-3">Thank you !<br /></p>
        <p class="text-lg flex justify-center">We Saved your Response.</p>

        <!-- Optional Button (like OK) -->
        <button
          @click="goToMobileAppPage"
          class="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-green-600 w-full"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios' // Ensure axios is imported

export default {
  data() {
    return {
      esigntype: null, // Initialize as null
      appSessionId: null, // Initialize appSessionId
    }
  },
  mounted() {
    this.esigntype = this.getEsignTypeFromUrl() // Get esigntype when component is mounted
    this.appSessionId = localStorage.getItem('appSessionId') // Get appSessionId from local storage
  },
  methods: {
    getEsignTypeFromUrl() {
      if (typeof window !== 'undefined') {
        // Check if window is defined
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('esigntype')
      }
      return null // Return null if not in client-side context
    },
    async submitSignature() {
      const RAppId = this.appSessionId // Use the session ID
      const esignType = this.esigntype // Use the e-sign type from the URL

      // Create a FormData object to send the data
      const formData = new FormData()
      formData.append('RAppId', RAppId)
      formData.append('esignType', esignType)

      try {
        // Make the API call
        const response = await axios.post('https://teamap.gwcindia.in/inspection/api/inspection-esign.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Handle the response
        console.log('E-signature Response:', response.data)
        if (response.data) {
          const base64Url = response.data.dataEsign
          const decodedUrl = atob(base64Url) // Decode the Base64 string

          // Navigate to the decoded URL
          window.location.href = decodedUrl
        }
      } catch (error) {
        console.error('Error submitting signature:', error)
        alert('Failed to submit signature. Please try again.')
      }
    },
    goToMobileAppPage() {
      this.$router.push({ name: 'mobileAppPage1' })
    },
  },
}
</script>
