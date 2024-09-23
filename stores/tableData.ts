import { defineStore } from 'pinia';
export const userDataStore = defineStore('todos', {
  state: () => ({
    todos: [],
    employeeName:'',
    employeeId:''
  }),
  actions: {
    setUser(employeeName: string,employeeId: string) {
      this.employeeName =employeeName
      this.employeeId=employeeId
     console.log(this.employeeName,  this.employeeId)
    },
  
      
  },
})
