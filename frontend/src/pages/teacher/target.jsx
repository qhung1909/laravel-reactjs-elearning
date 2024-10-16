import { Checkbox } from "@radix-ui/react-checkbox";
import { useState } from "react";

export const StudyTarget = () => {
    console.log("Rendering StudyTarget");

    const [inputs, setInputs] = useState([
        "Ví dụ: Xác định vai trò và trách nhiệm của người quản lý dự án",
        "Ví dụ: Ước tính tiến độ và ngân sách dự án",
        "Ví dụ: Xác định và quản lý rủi ro dự án",
    ]);
    const [values, setValues] = useState(["", "", ""]);

    const [requirementInputs, setRequirementInputs] = useState([
        "Ví dụ: Không cần kinh nghiệm lập trình. Bạn sẽ học mọi thứ mà bạn cần biết."
    ]);
    const [requirementValues, setRequirementValues] = useState([""]);

    const [audienceInputs, setAudienceInputs] = useState([
        "Ví dụ: Các nhà phát triển Python sơ cấp muốn tìm hiểu về khoa học dữ liệu"
    ]);
    const [audienceValues, setAudienceValues] = useState([""]);

    const handleAddInput = () => {
        setInputs([...inputs, `Nhập mục tiêu học tập thứ ${inputs.length + 1}`]);
        setValues([...values, ""]);
    };

    const handleInputChange = (index, value) => {
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
    };

    const handleAddRequirementInput = () => {
        setRequirementInputs([...requirementInputs, `Nhập yêu cầu thứ ${requirementInputs.length + 1}`]);
        setRequirementValues([...requirementValues, ""]);
    };

    const handleRequirementInputChange = (index, value) => {
        const newValues = [...requirementValues];
        newValues[index] = value;
        setRequirementValues(newValues);
    };

    const handleAddAudienceInput = () => {
        setAudienceInputs([...audienceInputs, `Nhập mô tả đối tượng học viên thứ ${audienceInputs.length + 1}`]);
        setAudienceValues([...audienceValues, ""]);
    };

    const handleAudienceInputChange = (index, value) => {
        const newValues = [...audienceValues];
        newValues[index] = value;
        setAudienceValues(newValues);
    };

    const allInputsFilled = () => {
        return values.every(value => value.trim() !== "") &&
               requirementValues.every(value => value.trim() !== "") &&
               audienceValues.every(value => value.trim() !== "");
    };

    return (
        <>
            
        </>
    );
};
