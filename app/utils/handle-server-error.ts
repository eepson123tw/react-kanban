import { toast } from 'vue-sonner'

export function handleServerError(error) {
  console.log(error)
  if (error?.response) {
    // Handle specific error codes
    if (error.response.status === 304) {
      toast.error('Content not modified!')
    }
    // Add other error handling as needed
  }
  else {
    toast.error('An unexpected error occurred')
  }
}
