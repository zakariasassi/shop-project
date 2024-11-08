import React from "react";
import { LifeLine } from "react-loading-indicators";

function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <LifeLine
        color="#16BDCA"
        size="small"
        text="جاري تحميل البيانات"
        textColor=""
      />
    </div>
  );
}

export default Loading;
