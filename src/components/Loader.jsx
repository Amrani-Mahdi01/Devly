import { useEffect, useState } from "react";

export default function Loader() {




  return (
    <div
      className={`w-full h-screen fixed top-0 left-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 `}
    >
      <span className="loader w-40 h-40"></span>
    </div>
  );
}
