import { toast } from "sonner";

export const parseError = (error) => {
  let message = "Something went wrong";

  if (error.response) {
    message = error.response.data?.message || error.response.statusText || message;
    
    if (error.response.status === 500) {
      toast.error("Server error. We're looking into it!");
    } else if (error.response.status === 429) {
      toast.error("Too many requests. Please slow down!");
    } else {
      toast.error(message);
    }
  } else if (error.request) {
    message = "Network error. Please check your connection.";
    toast.error(message);
  } else {
    message = error.message;
    toast.error(message);
  }
  
  return message;
};