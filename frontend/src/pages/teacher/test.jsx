"use client"

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"

export function FormWithSingleCheckbox() {
  // State quản lý giá trị các trường nhập liệu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    allFieldsComplete: false,
  });

  // Hàm kiểm tra nếu tất cả các trường đã hoàn thành
  const checkCompletion = (updatedFormData) => {
    const { name, email, address } = updatedFormData;
    return name !== "" && email !== "" && address !== "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData({
      ...updatedFormData,
      allFieldsComplete: checkCompletion(updatedFormData),
    });
  };

  return (
    <form className="space-y-6">
      {/* Phần 1: Nhập tên */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium leading-none">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Phần 2: Nhập email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Phần 3: Nhập địa chỉ */}
      <div className="flex flex-col">
        <label htmlFor="address" className="text-sm font-medium leading-none">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Checkbox tự động tích */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allFieldsComplete"
          checked={formData.allFieldsComplete}
          disabled
        />
        <label
          htmlFor="allFieldsComplete"
          className="text-sm font-medium leading-none"
        >
          All fields completed
        </label>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!formData.allFieldsComplete}
        className={`px-4 py-2 text-white rounded ${
          formData.allFieldsComplete ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </form>
  );
}
