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
          <canvas
            ref="signatureCanvas"
            class="w-full h-full"
          ></canvas>
        </div>
        <button
          class="bg-[#1E3A8A] hover:bg-[#1E3A8A] text-white font-bold py-2 my-3 rounded-md w-full"
          @click="submitSignature"
        >
          Proceed to Sign
        </button>
      </div>

      <div v-else-if="esigntype === 'emp'">
        <h2 class="text-lg text-blue-900 font-medium my -2">Thank you for your response!</h2>
        <p>Your responses are stored.</p>
        <button
          class="bg-[#1E3A8A] hover:bg-[#1E3A8A] text-white font-bold py-2 my-3 rounded-md w-full"
          @click="goToMobileAppPage"
        >
          Thank You
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      esigntype: null, // Initialize as null
    }
  },
  mounted() {
    this.esigntype = this.getEsignTypeFromUrl() // Get esigntype when component is mounted
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
    submitSignature() {
      // Logic to handle signature submission
    },
    goToMobileAppPage() {
      this.$router.push({ name: 'mobileAppPage1' })
    },
  },
}
</script>
