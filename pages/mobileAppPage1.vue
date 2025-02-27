<template>
  <div>
    <div class="rounded-md shadow-md bg-white block md:hidden">
      <div
        v-if="showInputFields"
        class="input-fields p-6 bg-white rounded-md shadow-md"
      >
      <h2 class="text-xl flex justify-center font-bold mb-2">
         Inspection AP
        </h2>

        <h2 class="text-ld font-bold mb-2">
          Please enter the following details:
        </h2>

        <div class="mb-2">
          <label
            for="customerId"
            class="block text-sm font-medium text-gray-700 mb-1"
            >AP ID</label
          >
          <input
            id="customerId"
            v-model="inputValues.customerId"
            @input="fetchApData"
            placeholder="Enter AP ID"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div class="mb-2">
          <label
            for="clientCompanyName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >AP Company Name</label
          >
          <input
            id="clientCompanyName"
            v-model="inputValues.clientCompanyName"
            placeholder="Enter AP Company Name"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        
        <div class="mb-2">
          <label
            for="state"
            class="block text-sm font-medium text-gray-700 mb-1"
            >AP State</label
          >
          <input
            id="state"
            v-model="inputValues.state"
            placeholder="Enter AP State"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div class="mb-2">
          <label
            for="employeeId"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employee ID</label
          >
          <input
            id="employeeId"
            v-model="inputValues.employeeId"
            @input="fetchEmpData"
            placeholder="Enter Employee ID"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div class="mb-2">
          <label
            for="employeeName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employee Name</label
          >
          <input
            id="employeeName"
            v-model="inputValues.employeeName"
            placeholder="Enter Employee Name"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

      
        <div class="mb-2">
          <label
            for="employeeId"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employee Mobile</label
          >
          <input
            id="employeeId"
            v-model="inputValues.employeeMobile"
            placeholder="Enter Employee Mobile"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        <div class="mb-2">
          <label
            for="employeeId"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employee Email</label
          >
          <input
            id="employeeId"
            v-model="inputValues.employeeEmail"
            placeholder="Enter Employee Email"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>


        <button
          @click="submitInputValues"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-200"
        >
          Submit
        </button>
      </div>
      <div v-else>
        <div class="flex justify-between items-center px-3 py-0.5">
          <h2 class="text-xl text-blue-900 font-bold">{{ displayCusId }}</h2>
        </div>
        <div class="border-b">
          <h3 class="font-medium mb-1 px-3">{{ displayCompanyName }}</h3>
          <p class="text-gray-600 font-medium px-3">{{ displayState }}</p>
          <p class="px-3" :class="coordinates ? 'text-gray-500' : 'text-error'">
            <span class="text-blue-900">GPS</span>
            <span class="px-3 text-error text-sm" v-if="!coordinates"
              ><VIcon
                icon="ri-information-line"
                size="18"
                color="error"
                class="mb-1"
              />
              Please Enable Location & reload</span
            >
            {{
              coordinates
                ? `${coordinates.latitude}, ${coordinates.longitude}`
                : " "
            }}
          </p>
        </div>

        <div v-if="questions[currentIndex]">
          <div>
            <!-- Employee Image Section -->
            <div
              v-if="questions[currentIndex].questionId === '32'"
              class="mb-2 px-3"
            >
              <h4 class="text-lg text-blue-900 font-medium mb-2 h-200">
                Employee Image
              </h4>
              <div >
                <div
                  class="w-full border-dotted border-2 rounded h-60 relative my-4"
                >
                  <div
                    class="absolute inset-0 flex flex-col justify-center items-center py-20"
                    v-if="!showEmployeeCamera && !capturedEmployeeImage"
                    @click="toggleEmployeeCamera"
                  >
                    <img
                      src="@/public/picture.png"
                      alt="Placeholder"
                      class="w-10 h-10 object-cover"
                    />
                    <div>
                      <div class="mt-2 font-bold">
                        Live Capture <span class="text-error"> *</span>
                      </div>
                    </div>
                  </div>
                  <video
                    ref="employeeVideo"
                    v-if="showEmployeeCamera && !capturedEmployeeImage"
                    class="absolute inset-0 w-full h-full object-cover"
                    autoplay
                  ></video>
                  <img
                    v-if="capturedEmployeeImage"
                    :src="capturedEmployeeImage"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div
                  v-if="showEmployeeCamera && !capturedEmployeeImage"
                  class="py-3"
                >
                  <button
                    @click="captureEmployeeImage"
                    class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
                  >
                    Capture
                  </button>
                </div>
                <div v-if="capturedEmployeeImage" class="py-3">
                  <button
                    @click="retakeEmployeeImage"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-100"
                  >
                    Retake
                  </button>
                </div>
              </div>
            </div>

            <!-- AP Image Section -->
            <div
              v-else-if="questions[currentIndex].questionId === '33'"
              class="mb-2 px-3"
            >
              <h4 class="text-lg text-blue-900 font-medium mb-2 h-200">
                AP Image
              </h4>
              <div >
                <div
                  class="w-full border-dotted border-2 rounded h-60 relative my-4"
                >
                  <div
                    class="absolute inset-0 flex flex-col justify-center items-center py-20"
                    v-if="!showClientCamera && !capturedClientImage"
                    @click="toggleClientCamera"
                  >
                    <img
                      src="@/public/picture.png"
                      alt="Placeholder"
                      class="w-10 h-10 object-cover"
                    />
                    <div>
                      <div class="mt-2 font-bold">
                        Live Capture <span class="text-error"> *</span>
                      </div>
                    </div>
                  </div>
                  <video
                    ref="clientVideo"
                    v-if="showClientCamera && !capturedClientImage"
                    class="absolute inset-0 w-full h-full object-cover"
                    autoplay
                  ></video>
                  <img
                    v-if="capturedClientImage"
                    :src="capturedClientImage"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div
                  v-if="showClientCamera && !capturedClientImage"
                  class="py-3"
                >
                  <button
                    @click="captureClientImage"
                    class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
                  >
                    Capture
                  </button>
                </div>
                <div v-if="capturedClientImage" class="py-3">
                  <button
                    @click="retakeClientImage"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-100"
                  >
                    Retake
                  </button>
                </div>
              </div>
            </div>

            <!-- Other Questions Section -->
            <div v-else class="mb-2 px-3">
              <div class="text-gray-600 py-3">
                Question {{ questions[currentIndex].questionId }} of
                31
              </div>
              <div class="question-container">
                <h4 class="text-lg text-blue-900 font-medium mb-2 h-200">
                  {{ questions[currentIndex].question }}
                </h4>
                <div v-if="questions[currentIndex].parts">
                  <div
                    v-for="(part, index) in questions[currentIndex].parts"
                    :key="index"
                  >
                    <h5 class="text-md text-blue-900 font-medium mb-1">
                      {{ part.part }}
                    </h5>
                  </div>
                </div>
                <div class="flex justify-between mb-2">
                  <label class="inline-flex items-center mb-5 cursor-pointer">
                    <span
                      class="mr-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >No</span
                    >
                    <input
                      type="checkbox"
                      :value="this.questions[currentIndex].isMessageMandatory"
                      :checked="this.questions[currentIndex].isMessageMandatory"
                      @input="
                        updateYesNoAnswer(
                          questions[currentIndex].questionId,
                          $event.target.checked,
                          questions[currentIndex].isMessageMandatory
                        )
                      "
                      class="sr-only peer"
                    />
                    <div
                      class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                    <span
                      class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Yes</span
                    >
                  </label>
                </div>
                <!-- rest of the question content -->
              </div>
              <div v-if="questions[currentIndex].isLiveCameraMandatory == true">
                <div
                  class="w-full border-dotted border-2 rounded h-40 relative my-4"
                >
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
                      <div class="mt-2 font-bold">
                        Live Capture <span class="text-error"> *</span>
                      </div>
                    </div>
                  </div>
                  <video
                    ref="video"
                    v-if="showCamera && !capturedImage"
                    class="absolute inset-0 w-full h-full object-cover"
                    autoplay
                  ></video>
                  <img
                    v-if="capturedImages[currentIndex]"
                    :src="capturedImages[currentIndex]"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div v-if="showCamera && !capturedImage" class="py-3">
                  <button
                    @click="capture"
                    class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
                  >
                    Capture
                  </button>
                </div>
                <div v-if="capturedImages[currentIndex]" class="py-3">
                  <button
                    @click="retake"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-100"
                  >
                    Retake
                  </button>
                </div>
              </div>
              <div>
                <div v-if="questions[currentIndex].isMessageMandatory">
                  <textarea
                    id="message"
                    rows="3"
                    v-model="notes[currentIndex]"
                    placeholder="  Optional Message / Notes * "
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <div v-else>
                  <textarea
                    id="message"
                    rows="3"
                    v-model="notes[currentIndex]"
                    placeholder="  Optional Message / Notes   "
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
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
          
            >
              Next →
            </button>
            <Pagination :pages="pages" :prev="prev" :next="next" />
          </div>
        </div>
        <div v-if="showConfirmationModal" class="modal-overlay">
          <div class="modal-content">
            <!-- Close Button -->
            <span class="close" @click="showConfirmationModal = false"
              >&times;</span
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
            <p class="font-medium text-xl text-gray-800">
              Thank you !<br />
              <span class="text-lg">We Saved your Response.</span>
            </p>

            <!-- Optional Button (like OK) -->
            <button
              @click="reloadPage"
              class="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="hidden md:block flex justify-center text-center items-center my-20"
    >
      Please open this page using mobile device !
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";
// import { userDataStore } from '~/stores/tableData'
// const userStore = userDataStore()
export default {
  data() {
    return {
      showClientCamera: false,
      capturedClientImage: null,
      showEmployeeCamera: false,
      capturedEmployeeImage: null,
      yesNoAnswers: {},
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
      cusId: null,
      empId: null,
      empName: null,
      empMobile: null,
      empEmail: null,
      companyName: null,
      state: null,
      nextEnabled: false, // To control the Next button state
      showConfirmationModal: false,
      showInputFields: false, // To control the visibility of input fields
      inputValues: {
        customerId: "",
        employeeName: "",
        employeeId: "",
        clientCompanyName: "",
        state: "",
        employeeMobile:"",
        employeeEmail:""
      },
      appSessionId: "",
    };
  },
  mounted() {
    const route = useRoute();
    this.startCamera(),
      this.getLocation(),
      this.fetchData(),
      (this.yesNoAnswers = new Array(this.questions.length).fill(false));

  const storedEmpName = localStorage.getItem('employeeName');
  const storedEmpId = localStorage.getItem('employeeId');
  const storedCustomerId = localStorage.getItem('CustomerId');
  const storedCompanyName = localStorage.getItem('OrgName');
  const storedState = localStorage.getItem('state');
  const storedEmpMobile = localStorage.getItem('employeeMobile');
  const storedEmpEmail = localStorage.getItem('employeeEmail');
    if (
      !this.$route.query.customerId ||
      !this.$route.query.employeeName ||
      !this.$route.query.employeeId ||
      !this.$route.query.clientCompanyName ||
      !this.$route.query.state
    ) {
      if (storedEmpName) {
        this.showInputFields = false;
      } else {
        this.showInputFields = true;
      }
    } else {
      this.cusId = this.$route.query.customerId
        ? this.$route.query.customerId
        : "";
      console.log(this.cusId, " this.cusId");
      this.empName = this.$route.query.employeeName
        ? this.$route.query.employeeName
        : "";
      console.log(this.empName, " this.empName");
      this.empId = this.$route.query.employeeId
        ? this.$route.query.employeeId
        : "";
      console.log(this.empId, " this.empId");
      this.companyName = this.$route.query.clientCompanyName
        ? this.$route.query.clientCompanyName
        : "";
      console.log(this.companyName, " this.companyName");
      this.state = this.$route.query.state ? this.$route.query.state : "";
      console.log(this.state, " this.state");
    }
     this.empName = storedEmpName || this.empName;
  this.empId = storedEmpId || this.empId;
  this.cusId = storedCustomerId || this.cusId;
  this.companyName = storedCompanyName || this.companyName;
  this.state = storedState || this.state;
  this.empEmail=storedEmpEmail || this.empEmail;
  this.empMobile=storedEmpMobile || this.empMobile;
  const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    this.appSessionId = `${day}${month}${year}${hours}${minutes}${seconds}`; // Set AppSessionId



  },
  computed: {
    displayCusId() {
      return this.cusId ? this.cusId : "";
    },
    displayCompanyName() {
      return this.companyName ? this.companyName : "";
    },
    displayState() {
      return this.state ? this.state : "";
    },
  },

  methods: {
    async fetchEmpData() {
debugger
    if (this.inputValues.employeeId.length > 5) {
      try {
        const response = await axios.get(`https://teamap.gwcindia.in/inspection/api/inspection-emp-master.php?empId=${this.inputValues.employeeId}`);
        // Handle the response as needed
        console.log("Employee Data:", response.data);
        this.inputValues.employeeName=response.data.empData.empName
        this.inputValues.employeeMobile=response.data.empData.empMobile
     
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Failed to fetch employee data. Please try again.");
      }
    }
  },
    reloadPage() {
      this.fetchInspectionPDF();
      this.showConfirmationModal = false; // Optionally hide the modal first
      location.reload(); // Reload the page
    },
  
    async fetchApData() {
    if (this.inputValues.customerId.length > 3) {
      try {
        const response = await axios.get(`https://teamap.gwcindia.in/inspection/api/inspection-master.php?remeshireCode=G1TPSA&customerId=${this.inputValues.customerId}`);
        // Handle the response as needed
        console.log("Employee Data:", response.data);
     this.inputValues.clientCompanyName=response.data.remeshireData.REMESHIRE_NAME;
     this.inputValues.state=response.data.remeshireData.state;

      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Failed to fetch employee data. Please try again.");
      }
    }
  },
  async fetchInspectionPDF() {
    try {
      const sessionId = this.appSessionId; // Use the session ID you want to pass
      const response = await axios.get(`https://teamap.gwcindia.in/inspection/api/Inspection_pdf.php?sessionId=${sessionId}`);
      
      // Handle the response as needed
      console.log("PDF Response:", response.data);
      
      // // If the response is a PDF file, you might want to download it
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'inspection.pdf'; // Set the desired file name
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("Failed to fetch the PDF. Please try again.");
    }
  },

    capturecheck() {
      const canvas = document.createElement("canvas");
      const video = this.$refs.clientVideo;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/png");
      this.capturedImages[this.currentIndex] = capturedImage; // store the captured image for the current question
      this.showCamera = false;
      console.log(this.capturedImages, "this.capturedImages");
    },
    toggleClientCamera() {
    this.showClientCamera = !this.showClientCamera;
    if (this.showClientCamera) {
      this.startClientCamera();
    }
  },
  async startClientCamera() {
    this.currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    this.$refs.clientVideo.srcObject = this.currentStream;
  },
  captureClientImage() {
    const canvas = document.createElement('canvas');
    const video = this.$refs.clientVideo;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedClientImage = canvas.toDataURL('image/png');
    this.showClientCamera = false;
  },
    submitInputValues() {
      debugger
      // Check if any input values are empty
      if (
        !this.inputValues.customerId ||
        !this.inputValues.employeeName ||
        !this.inputValues.employeeId ||
        !this.inputValues.clientCompanyName ||
        !this.inputValues.state||
     
        !this.inputValues.employeeEmail ||
        !this.inputValues.employeeMobile

      ) {
        alert("Please fill all the details!");

        return;
      }
      console.log(this.inputValues.employeeEmail,this.inputValues.employeeMobile)

      // If all fields are filled, assign the values
      this.cusId = this.inputValues.customerId;
      this.empName = this.inputValues.employeeName;
      this.empId = this.inputValues.employeeId;
      this.companyName = this.inputValues.clientCompanyName;
      this.state = this.inputValues.state;
      this.empMobile = this.inputValues.employeeMobile;
      this.empEmail = this.inputValues.employeeEmail;
   localStorage.setItem('employeeName', this.empName);
  localStorage.setItem('employeeId', this.empId);
  localStorage.setItem('CustomerId', this.cusId);
  localStorage.setItem('OrgName', this.companyName);
  localStorage.setItem('state', this.state); 
  localStorage.setItem('employeeEmail', this.empEmail); 
  localStorage.setItem('employeeMobile', this.empMobile); 

      const storedEmpName = localStorage.getItem("employeeName");
      console.log("Retrieved employeeName:", storedEmpName);

      const storedEmpId = localStorage.getItem("employeeId");
      console.log("Retrieved employeeId:", storedEmpId);

      this.reloadComponent();
    },
    reloadComponent() {
      // This method can be used to reset the component state or force a re-render
      this.showInputFields = false; // Hide input fields
      window.location.reload();
    },
    retakeClientImage() {
      this.showClientCamera = true;
      this.capturedClientImage = null;
      this.startClientCamera();
    },
 toggleEmployeeCamera() {
 
    this.showEmployeeCamera = !this.showEmployeeCamera;
   
    if (this.showEmployeeCamera) {
      this.startEmployeeCamera();
    }
  },
  async startEmployeeCamera() {
    try {
        this.currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        this.$refs.employeeVideo.srcObject = this.currentStream;
        console.log("Employee camera started");
    } catch (error) {
        console.error("Error accessing employee camera:", error);
    }
},
    captureEmployeeImage() {
    const canvas = document.createElement('canvas');
    const video = this.$refs.employeeVideo;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedEmployeeImage = canvas.toDataURL('image/png');
    this.showEmployeeCamera = false;
  },

    retakeEmployeeImage() {
      this.showEmployeeCamera = true;
      this.capturedEmployeeImage = null;
      this.startEmployeeCamera();
    },
    updateYesNoAnswer(questionId, value, index) {
      console.log(index, "index");
      const currentQuestionIndex = this.questions.findIndex(
        (question) => question.questionId === questionId
      );
      console.log(currentQuestionIndex, "currentQuestionIndex");
      if (currentQuestionIndex !== -1) {
        this.questions[currentQuestionIndex].isMessageMandatory = value;
      }
      console.log(
        index,
        "indexfinal",
        this.questions[currentQuestionIndex].isMessageMandatory
      );
    },
    toggleCamera() {
    
      this.showCamera = !this.showCamera;
      if (this.showCamera) {
        this.startCamera();
      }
    },
    async startCamera() {
      this.currentStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode },
      });
      this.$refs.video.srcObject = this.currentStream;
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
    
      const canvas = document.createElement("canvas");
      const video = this.$refs.video;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/png");
      this.capturedImages[this.currentIndex] = capturedImage; // store the captured image for the current question
      this.showCamera = false;
      console.log(this.capturedImages, "this.capturedImages");
    },

    async getLocation() {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.coordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.locationLoading = false;
          },
          (error) => {
            if (error.code === 1) {
              // PERMISSION_DENIED
              console.error("Location permission denied");
              // You can display a prompt to the user to grant permission
              alert("Please grant location permission to continue");
            } else {
              console.error("Error getting location:", error);
            }
            this.locationLoading = false;
          },
          { enableHighAccuracy: true }
        );
      } catch (error) {
        console.error("Error getting location:", error);
      }
    },
    retake() {
      this.showCamera = true;
      this.capturedImage = null;
      this.capturedImages[this.currentIndex] = null;
      this.startCamera();
    },
    async fetchData() {
      try {
        // const response = await axios.get('https://g1.gwcindia.in/ap_inspection/get-questions.php')
        const response = [
          {
            questionId: "1",
            question:
              "1 Whether all clients are registered directly with the Trading Member only.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "2",
            question:
              "2 There is no movement of Funds and securities between the clients and AP.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "3",
            question:
              "3 There are no fixed payments at regular intervals to the clients mapped to AP.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "4",
            question: "4 There are no cash dealings done with clients by AP.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "5",
            question:
              "5 The AP is not involved in any fund-based activities / collecting deposits from investors / unauthorised trading or any other such schemes.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "6",
            question:
              "6 The AP is not involved in any illegal/dabba/paper trading.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "7",
            question:
              "7 The AP has not dealt with any unregistered intermediary on behalf of its clients/self.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "8",
            question:
              "8 The AP is not involved in accepting deposits from the public and giving assured returns to their clients.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "9",
            question:
              "9 Complaints received against AP pertaining to Assured Returns / Unauthorised Trading / Dabba Trading / associated with unregistered intermediary.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "10",
            question:
              "10 The AP does not offer any incentives to clients for opening trading accounts.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "11",
            question:
              "11 AP has sought any authorisation to trade on behalf of its clients.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Dealing with clients",
            time: "time",
            date: "date",
          },
          {
            questionId: "12",
            question:
              "12 Advertisements for soliciting business are not issued by the APs in newspapers / pamphlets / journals / magazines / emails including social media like Facebook, Instagram, telegram channels etc., without seeking appropriate approvals from the Exchange, through the Trading Member. This includes not publishing performance returns etc.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "13",
            question:
              "13 All AP terminals are as per the information reported to the Exchange.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Terminal operations and related systems",
            time: "time",
            date: "date",
          },
          {
            questionId: "14",
            question:
              "14 Trading terminals are operated by approved and certified users.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Terminal operations and related systems",
            time: "time",
            date: "date",
          },
          {
            questionId: "15",
            question:
              "15 Adequate systems, including voice recording, have been put in place, with a view to ensure recording of order placement from clients. Trading Members must ensure that APs who do not have trading terminals assigned to them, cannot place trades on behalf of the Trading Member’s clients.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Terminal operations and related systems",
            time: "time",
            date: "date",
          },
          {
            questionId: "16",
            question:
              "16 Documents like contract notes, statement of funds, daily margin statement are not generated and issued by the AP. However, AP may provide administrative assistance in procurement of documents from the Trading Member, after maintaining proper records of the same.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "17",
            question:
              "17 The AP has not dealt with / or associated with any other Trading Member/AP on behalf of its clients/self on the same Stock Exchange.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "18",
            question:
              "18 Trading activities/Turnover of AP/Clients mapped with the AP are monitored, and necessary actions/investigations are undertaken on a timely basis.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "19",
            question:
              "19 The AP has the necessary infrastructure like adequate office space, equipment, and manpower to effectively discharge the activities on behalf of the Trading Member.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "20",
            question:
              "20 Complaints received by and against the APs are handled appropriately and proper records are maintained.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "21",
            question:
              "21 Proper segregation and demarcation are maintained at AP office.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "22",
            question:
              "22 Notice board of the Trading Member containing all details/information prescribed from time to time, are displayed at the AP/s location.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "23",
            question:
              "23 SEBI registration certificate of the Trading Member and registration letter issued by the Exchange is displayed at the location.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "24",
            question:
              "24 As required by SEBI circular CIR/MIRSD/3/2014 dated August 28, 2014, information about the grievance redressal mechanism available to investors is prominently displayed at the location.",
            isMessageMandatory: false,
            isLiveCameraMandatory: true,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "25",
            question:
              "25 Branch/AP records/data are properly maintained with confidentiality in a secure manner including sufficient backup.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "26",
            question:
              "26 All clients mapped to the AP/Branch are notified at least thirty days before the change.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "27",
            question:
              "27 Notice Board and applicable SEBI registration certificates are immediately put up at the new location.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "28",
            question:
              "28 The new location, including details of terminals if any, have been duly reported to the Exchange, and the old location, including terminals at the old location if any have been deactivated.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "29",
            question:
              "29 At the new location, adequate systems including voice recording, display of Notice Board and SEBI Registration certificates, and terminals etc. have been promptly installed to ensure the smooth functioning of business operations and the recording of order placements from clients.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "30",
            question:
              "30 Any changes in the AP's contact details, such as registered / communication address, email address, mobile number or any changes in the Directors/ Partners of AP, are not reported/ incorrectly reported to the Members.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "31",
            question:
              "31 The AP's mobile number, and email address are not mapped to any of its client in UCC uploaded to Exchange.",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "Management of branches / AP and internal control",
            time: "time",
            date: "date",
          },
          {
            questionId: "32",
            question: "Employee Image",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "",
            time: "time",
            date: "date",
            
          },
          {
            questionId: "33",
            question: "AP Image",
            isMessageMandatory: false,
            isLiveCameraMandatory: false,
            type_name: "",
            time: "time",
            date: "date",
           
          },
        ];

        this.questions = response.map((question) => ({
          ...question,
          isMessageMandatory: false,
        }));
        this.notes = new Array(this.questions.length).fill("");

        console.log(response.data, "response.data");

        // Create pagination
        this.pages = this.questions.map((question, index) => ({
          href: `/question/${index + 1}`,
          text: `Question ${index + 1}`,
        }));
        this.prev =
          this.currentIndex > 0
            ? { href: `/question/${this.currentIndex}`, text: "Previous" }
            : null;
        this.next =
          this.currentIndex < this.questions.length - 1
            ? { href: `/question/${this.currentIndex + 2}`, text: "Next" }
            : null;
      } catch (err) {
        console.error("Error:", err);
      } finally {
      }
    },
    nextStep() {
  if (this.coordinates && this.coordinates.latitude && this.coordinates.longitude) {
    // Check if the current index is the last question
    if (this.currentIndex === this.questions.length - 1) {
      // Call postData before showing the confirmation modal
      this.postData();
      this.showConfirmationModal = true; // Show the confirmation modal
    } else {
      // Proceed with the normal flow for other questions
      if (this.currentIndex < this.questions.length - 1) {
        const isMessageRequired = this.notes[this.currentIndex] == "";
        const isCameraRequired =
          this.capturedImages[this.currentIndex] == null &&
          this.capturedImages[this.currentIndex] == undefined;

        if (
          isMessageRequired &&
          this.questions[this.currentIndex].isMessageMandatory &&
          this.questions[this.currentIndex].isLiveCameraMandatory &&
          isCameraRequired &&
          this.questions[this.currentIndex].isclientImage != true
        ) {
          alert("Please fill the Mandatory Fields !");
        } else if (
          this.questions[this.currentIndex].isLiveCameraMandatory &&
          isCameraRequired &&
          this.questions[this.currentIndex].isclientImage != true
        ) {
          alert("Please Capture Image !");
        } else if (
          this.questions[this.currentIndex].isMessageMandatory &&
          isMessageRequired &&
          this.questions[this.currentIndex].isclientImage != true
        ) {
          alert("Please fill Message Field !");
        } else {
          // Call postData before moving to the next question
          this.postData();

          this.currentIndex++;
          this.showCamera = false;
          this.capturedImage = null;
        }

        if (
          this.questions[this.currentIndex].isclientImage &&
          this.capturedClientImage != null &&
          this.capturedClientImage != undefined
        ) {
          this.currentIndex++;
          this.showCamera = false;
          this.capturedImage = null;
        }
      } else {
        this.next = null;
      }
    }
  } else {
    alert("Please Enable Location in your device !");
  }
},
    previousStep() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.showCamera = false;
        this.capturedImage = null;
      } else {
        this.prev = null;
      }
    },
    async postData() {
  try {
    if (!Array.isArray(this.questions)) {
      console.error("Questions is not defined or not an array");
      return;
    }

    // Generate AppSessionId
    const now = new Date();
    const appSessionId = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear().toString().slice(-2)}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

    // Get the current question
    const currentQuestion = this.questions[this.currentIndex];

    // Check if the current question requires an image and if it has been captured
    let image = "";
    if (currentQuestion.isLiveCameraMandatory) {

        // For questions 1 to 31, check the captured image from the array
        image = this.capturedImages[this.currentIndex];
        if (!image) {
          console.warn(`Image not captured for question ID: ${currentQuestion.questionId}`);
          alert("Please capture the image before proceeding.");
          return; // Exit if the image is mandatory but not captured
        }
      
    }
    else{
      if (currentQuestion.questionId === "32") {
        // For question 32, check the captured employee image
        image = this.capturedEmployeeImage;
        if (!image) {
          console.warn(`Image not captured for question ID: ${currentQuestion.questionId}`);
          alert("Please capture the employee image before proceeding.");
          return; // Exit if the image is mandatory but not captured
        }
      } else if (currentQuestion.questionId === "33") {
        // For question 33, check the captured client image
        image = this.capturedClientImage;
        if (!image) {
          console.warn(`Image not captured for question ID: ${currentQuestion.questionId}`);
          alert("Please capture the client image before proceeding.");
          return; // Exit if the image is mandatory but not captured
        }
      }
    }

    // Prepare the data for the current question
    const questionData = {
      questionId: currentQuestion.questionId,
      question: currentQuestion.question,
      message: this.notes[this.currentIndex] || "",
      Image: image,
      type: currentQuestion.type_name,
      EmpId: this.empId || "GUD001",
      EmpName: this.empName || "john",
      EmpMobile: this.empMobile || "GUD001",
      EmpEmail: this.empEmail || "john",
      customerId: this.cusId || "A101",
      companyName: this.companyName || "Finy Wealth",
      state: this.state || "Andhra Pradesh",
      lat: this.coordinates.latitude,
      lan: this.coordinates.longitude,
      data: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      AppSessionId: this.appSessionId,
      qStatus: currentQuestion.isMessageMandatory,
     
    };
    switch (currentQuestion.questionId) {
  case "33":
    questionData.thankyou = "1";
    break;
 
  
  default:
  
    break;
}

    // Log the question data for debugging
    console.log("Question Data to Send:", questionData);

    // Make the API call with the question data
    const response = await axios.post(
      "https://teamap.gwcindia.in/inspection/api/inspection-api.php",
      {
        questions: [questionData], // Send as an array
      }
    );

    // Log the response for debugging
    console.log("API Response:", response.data);

    // Add the sent question ID to the sentQuestions array to prevent resending
    this.sentQuestions.push(currentQuestion.questionId);

  } catch (err) {
    console.error("Error:", err);
  }
}

  },
};
</script>


<style scoped>
.p-menu-list {
}
.question-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* height: 200px; adjust the height value as needed */
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Slightly darkened background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease; /* Smooth fade-in animation */
}

/* Modal Content Styles */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px; /* Small width for the modal */
  max-width: 100%;
  animation: zoomIn 0.3s ease;
}

/* Close Button Style */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #aaa;
}

.close:hover {
  color: #333;
}

/* Button Styling */
button {
  transition: background-color 0.3s ease;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
