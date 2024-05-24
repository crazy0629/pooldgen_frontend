import toast from "react-hot-toast";

export const checkIsAdmin = () => {
    const userDetails = localStorage.getItem('userDetails');
    if(userDetails){
    const parsed = JSON.parse(userDetails);
    if(parsed?.role === 0){
        return true;
    } else {
        toast.error("Please login first!");
        return false;
    }
    }
}