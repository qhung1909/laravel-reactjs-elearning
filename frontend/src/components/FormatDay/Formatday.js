import { format } from "date-fns";
 // Format ngày tháng
 export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Ngày không hợp lệ";

    return format(date, "dd/MM/yyyy - HH:mm a");
};
export const formatDateNoTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Ngày không hợp lệ";

    return format(date, "dd/MM/yyyy ");
};
