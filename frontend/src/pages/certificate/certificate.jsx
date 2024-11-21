import React from "react";

const CertificateTemplate = ({ studentName, courseName, completionDate }) => {
    return (
        <div className="max-w-screen-lg mx-auto relative bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl p-6 overflow-hidden">
            <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden">
                {/* Top-left */}
                <div className="absolute top-0 left-0 w-40">
                    <img src="/src/assets/images/topleftpattern.png" alt="" />
                </div>
                {/* Top-right */}
                <div className="absolute top-0 right-0 w-40">
                    <img src="/src/assets/images/toprightpattern.png" alt="" />
                </div>
                {/* Bottom-left */}
                <div className="absolute bottom-0 left-0 w-40">
                    <img src="/src/assets/images/botleftpattern.png" alt="" />
                </div>
                {/* Bottom-right */}
                <div className="absolute bottom-0 right-0 w-40">
                    <img src="/src/assets/images/botrightpattern.png" alt="" />
                </div>
                {/* Content Container */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-slate-800">
                            <p className="flex justify-center">
                                <img src="/src/assets/images/antlearn.png" className="w-28" alt="" />
                            </p>
                            <p className="text-2xl font-medium text-center font-title uppercase tracking-wide text-amber-700">
                                Ứng dụng học trực tuyến số 1 Việt Nam.
                            </p>
                        </div>
                    </div>
                    {/* Tên chứng nhận - tên người hoàn thành */}
                    <div className="text-center space-y-4 font-title">
                        <h1 className="text-6xl font-bold mb-4">Chứng nhận</h1>
                        <h2 className="text-4xl text-amber-700 font-serif font-bold">{studentName}</h2>
                        <p className="text-2xl text-amber-700 tracking-wide">Đã hoàn thành xuất sắc khóa học</p>
                    </div>
                    {/* Khóa học */}
                    <div className="text-center my-12">
                        <p className="text-3xl  text-slate-700 border-t-2 border-b-2 border-amber-200 py-4 px-8 inline-block">
                            {courseName}
                        </p>
                    </div>
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-16 px-10">
                        <div className="text-center">
                            <p className="text-xl font-serif mb-2">Ngày hoàn thành</p>
                            <p className="text-sm text-slate-600">{completionDate}</p>
                        </div>
                        {/* Medal Icon */}
                        <div className="w-40 flex items-center justify-center">
                            <img src="/src/assets/images/certificate.jpg" alt="" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-serif mb-2">Chữ ký già làng</p>
                            <p className="text-sm text-slate-600">Lozs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateTemplate;
