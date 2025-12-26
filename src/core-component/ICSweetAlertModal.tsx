import React from "react";
import Swal from "sweetalert2";
import { deleteIcon } from "../assets/icons/SvgIconList";

interface ISweetAlertProps {
  title?: string;
  text?: string;
  onConfirm: (id: number) => void; // Update the onConfirm function to accept an 'id'
  itemId: number | undefined; // Add a new prop 'itemId' to receive the 'id'
}

const ICSweetAlertModal: React.FC<ISweetAlertProps> = ({
  title,
  text,
  onConfirm,
  itemId,
}) => {
  const handleConfirm = () => {
    Swal.fire({
      title: title ? title : "Are you sure?",
      text: text ? text : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed && itemId) {
        onConfirm(itemId); // Pass the itemId to onConfirm
      }
    });
  };

  return <div onClick={handleConfirm}>{deleteIcon}</div>;
};

export default ICSweetAlertModal;
