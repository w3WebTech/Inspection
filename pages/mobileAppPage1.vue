<template>
  <div class="rounded-md shadow-md bg-white">
    <!-- Your page content here -->
    <div class="flex justify-between items-center p-3">
      <h2 class="text-xl text-blue-900 font-bold">A101</h2>
    </div>
    <div class="border-b">
      <h3 class="font-medium mb-1 px-3">Finy Wealth</h3>
      <p class="text-gray-600 font-medium px-3">Andhra Pradesh</p>
      <p
        class="px-3"
        :class="coordinates ? 'text-gray-500' : 'text-error'"
      >
        <span class="text-blue-900">GPS</span>
        {{ coordinates ? `${coordinates.latitude}, ${coordinates.longitude}` : 'Unable to get location,  ' }}
      </p>
      <p
        class="px-3 text-error"
        v-if="!coordinates"
      >
        <VIcon
          icon="ri-information-line"
          size="20"
          color="error"
          class="pb-1"
        />
        Please Enable Location & reload
      </p>
    </div>

    <div v-if="questions[currentIndex]">
      <div class="mb-2 p-3">
        <h4 class="text-lg text-blue-900 font-medium mb-2">{{ questions[currentIndex].question }}</h4>
        <p class="text-gray-600">Question {{ currentIndex + 1 }} of {{ questions.length }}</p>

        <div class="w-full border-dotted border-2 rounded h-60 relative my-4">
          <!-- Show picture image initially -->
          <div
            class="absolute inset-0 flex flex-col justify-center items-center py-20"
            v-if="!showCamera && !capturedImage"
            @click="toggleCamera"
          >
            <img
              src="@/public/picture.png"
              alt="Placeholder"
              class="w-10 h-10 object-cover"
            />
            <div class="mt-2 font-bold">Live Capture</div>
          </div>

          <!-- Live Camera Feed -->

          <video
            ref="video"
            v-if="showCamera && !capturedImage"
            class="absolute inset-0 w-full h-full object-cover"
            autoplay
          ></video>

          <!-- Captured Image -->
          <img
            v-if="capturedImage"
            :src="capturedImage"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <!-- Capture button only shown when live camera feed is displayed -->
        <div
          v-if="showCamera && !capturedImage"
          class="py-3"
        >
          <button
            @click="capture"
            class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
          >
            Capture
          </button>
          <!-- <button
            @click="switchCamera"
            class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-100"
          >
            Switch Camera
          </button> -->
        </div>

        <textarea
          id="message"
          rows="3"
          v-model="notes[currentIndex]"
          placeholder="  Optional Message / Notes"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <div class="flex justify-between p-3">
        <button
          @click="previousStep"
          class="border border-gray-500 text-gray-500 font-bold py-2 px-4 w-100 mr-2 rounded"
        >
          ← Previous
        </button>
        <button
          @click="nextStep"
          class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 w-100 rounded"
        >
          Next →
        </button>
        <Pagination
          :pages="pages"
          :prev="prev"
          :next="next"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      image: null,
      currentStream: null,
      facingMode: 'environment',
      showCamera: false,
      coordinates: null,
      questions: [],
      notes: [],
      currentIndex: 0,
      pages: [],
      prev: null,
      next: null,
      capturedImages: [],
    }
  },
  mounted() {
    this.startCamera(), this.getLocation(), this.fetchData()
  },
  methods: {
    toggleCamera() {
      this.showCamera = !this.showCamera
      if (this.showCamera) {
        this.startCamera()
      }
    },
    async startCamera() {
      this.currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: this.facingMode } })
      this.$refs.video.srcObject = this.currentStream
    },
    // async switchCamera() {
    //   this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'
    //   await this.startCamera()
    // },
    // capture() {
    //   const canvas = document.createElement('canvas')
    //   const video = this.$refs.video
    //   const context = canvas.getContext('2d')
    //   canvas.width = video.videoWidth
    //   canvas.height = video.videoHeight
    //   context.drawImage(video, 0, 0, canvas.width, canvas.height)
    //   this.capturedImage = canvas.toDataURL('image/png')
    //   this.showCamera = false
    //   console.log(this.capturedImage, '  this.capturedImage ')
    // },
    capture() {
      const canvas = document.createElement('canvas')
      const video = this.$refs.video
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const capturedImage = canvas.toDataURL('image/png')
      this.capturedImages[this.currentIndex] = capturedImage // store the captured image for the current question
      this.showCamera = false
      console.log(this.capturedImages, 'this.capturedImages')
    },
    async getLocation() {
      try {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.coordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
            this.locationLoading = false
          },
          error => {
            if (error.code === 1) {
              // PERMISSION_DENIED
              console.error('Location permission denied')
              // You can display a prompt to the user to grant permission
              alert('Please grant location permission to continue')
            } else {
              console.error('Error getting location:', error)
            }
            this.locationLoading = false
          },
          { enableHighAccuracy: true },
        )
      } catch (error) {
        console.error('Error getting location:', error)
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('https://g1.gwcindia.in/ap_inspection/get-questions.php')

        this.questions = response.data.data
        this.notes = new Array(this.questions.length).fill('')
        console.log(response.data, 'response.data')

        // Create pagination
        this.pages = this.questions.map((question, index) => ({
          href: `/question/${index + 1}`,
          text: `Question ${index + 1}`,
        }))
        this.prev = this.currentIndex > 0 ? { href: `/question/${this.currentIndex}`, text: 'Previous' } : null
        this.next =
          this.currentIndex < this.questions.length - 1
            ? { href: `/question/${this.currentIndex + 2}`, text: 'Next' }
            : null
      } catch (err) {
        console.error('Error:', err)
      } finally {
      }
    },
    previousStep() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      } else {
        this.prev = null
      }
    },
    nextStep() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
      } else {
        this.next = null
      }
    },
  },
}
</script>


<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.object-cover {
  object-fit: cover;
}
</style>
