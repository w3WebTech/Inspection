<template>
  <div class="rounded-md shadow-md bg-white">
    <!-- Your page content here -->
    <div class="flex justify-between items-center px-3 py-0.5">
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
        <span
          class="px-3 text-error text-sm"
          v-if="!coordinates"
          ><VIcon
            icon="ri-information-line"
            size="18"
            color="error"
            class="mb-1"
          />
          Please Enable Location & reload</span
        >
        {{ coordinates ? `${coordinates.latitude}, ${coordinates.longitude}` : ' ' }}
      </p>
    </div>

    <div v-if="questions[currentIndex]">
      <div class="mb-2 px-3">
        <div class="question-container">
          <h4 class="text-lg text-blue-900 font-medium mb-2 h-200">{{ questions[currentIndex].question }}</h4>

          <div class="flex justify-between mb-2">
            <p class="text-gray-600">Question {{ currentIndex + 1 }} of {{ questions.length }}</p>
            <div class="switch-toggle switch-3 switch-candy rounded-full h-7">
              <input
                id="on"
                name="state-d"
                class="green"
                type="radio"
                :value="true"
                @input="updateYesNo($event, currentIndex)"
                :checked="questions[currentIndex].yesNo === true"
              />
              <label
                for="on"
                class="green"
                onclick=""
                >Yes</label
              >

              <input
                id="off"
                name="state-d"
                class="red"
                type="radio"
                :value="false"
                @input="updateYesNo($event, currentIndex)"
                :checked="questions[currentIndex].yesNo === false"
              />
              <label
                for="off"
                class="red"
                onclick=""
                >No</label
              >
            </div>
          </div>
          <!-- rest of the question content -->
        </div>
        <div class="w-full border-dotted border-2 rounded h-40 relative my-4">
          <!-- Show picture image initially -->
          <div
            class="absolute inset-0 flex flex-col justify-center items-center py-20"
            v-if="!showCamera && !capturedImages[currentIndex]"
            @click="toggleCamera"
          >
            <img
              src="@/public/picture.png"
              alt="Placeholder"
              class="w-10 h-10 object-cover"
            />
            <div>
              <div
                v-if="questions[currentIndex].live == 1"
                class="mt-2 font-bold"
              >
                Live Capture
              </div>
              <div
                v-else
                class="mt-2 font-bold"
              >
                Live Capture <span class="text-error"> *</span>
              </div>
            </div>
          </div>

          <!-- Live Camera Feed -->

          <video
            ref="video"
            v-if="showCamera && !capturedImage"
            class="absolute inset-0 w-full h-full object-cover"
            autoplay
          ></video>

          <!-- Captured Image -->
          <!-- <img
            v-if="capturedImage"
            :src="capturedImage"
            class="absolute inset-0 w-full h-full object-cover"
          /> -->
          <img
            v-if="capturedImages[currentIndex]"
            :src="capturedImages[currentIndex]"
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
        <div
          v-if="capturedImages[currentIndex]"
          class="py-3"
        >
          <button
            @click="retake"
            class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-100"
          >
            Retake
          </button>
        </div>
        <div>
          <div v-if="questions[currentIndex].message == 1">
            <textarea
              id="message"
              rows="3"
              v-model="notes[currentIndex]"
              placeholder="  Optional Message / Notes "
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div v-else>
            <textarea
              id="message"
              rows="3"
              v-model="notes[currentIndex]"
              placeholder="  Optional Message / Notes * "
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="flex justify-between p-3">
        <button
          @click="previousStep"
          :disabled="currentIndex <= 0"
          class="border border-gray-500 text-gray-500 font-bold py-2 px-4 w-100 mr-2 rounded"
          :class="{ 'bg-gray-200': currentIndex <= 0 }"
        >
          ← Previous
        </button>
        <button
          @click="nextStep"
          class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 w-100 rounded"
          :disabled="this.currentIndex >= this.questions.length - 1"
          :class="{ 'bg-gray-200 hover:bg-gray-200': this.currentIndex >= this.questions.length - 1 }"
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
      yesNo: null,
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
      isLastQuestion: false,
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
    retake() {
      this.showCamera = true
      this.capturedImage = null
      this.capturedImages[this.currentIndex] = null
      this.startCamera()
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
    updateYesNo(event, index) {
      this.questions[index].yesNo = event.target.value === 'true'
    },
    nextStep() {
      console.log(this.currentIndex, this.questions.length, 'questions.length')
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
        this.showCamera = false
        this.capturedImage = null
      } else {
        this.next = null
      }
    },
    previousStep() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.showCamera = false
        this.capturedImage = null
      } else {
        this.prev = null
      }
    },
    async postData() {
      try {
        // Prepare the data
        const questions = this.questions.map((question, index) => {
          return {
            questionId: question.id,
            question: question.question,
            message: this.notes[index],
            Image: this.capturedImages[index],
            type: question.type,
            EmpId: 'GUD001',
            customerId: 'A101',
            companyName: 'Finy Wealth',
            state: 'Andhra Pradesh',
            lat: this.coordinates.latitude,
            lan: this.coordinates.longitude,
            data: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
          }
        })

        // Make a POST request to the API
        const response = await axios.post('https://your-api-url.com/submit-questions', {
          questions,
        })

        console.log(response.data)
      } catch (err) {
        console.error('Error:', err)
      }
    },
  },
}
</script>


<style scoped>
.switch-toggle {
  float: left;
  background: gray;
}
.switch-toggle input {
  position: absolute;
  opacity: 0;
}
.switch-toggle input + label {
  padding: 3px 4px;
  float: left;
  color: #fff;
  cursor: pointer;
}

.switch-toggle input:checked + .red {
  background: red;
  border-radius: 20px;
}

.switch-toggle input:checked + .green {
  background: green;
  border-radius: 20px;
}
.question-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160px; /* adjust the height value as needed */
}
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
