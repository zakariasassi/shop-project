import React from "react"
// import "./styles.css"

 function NavbarDark() {
  return (
    <div className=" lg:visible  max-md:hidden max-sm:hidden  flex flex-col w-screen justify-start items-start  gap-[324px] h-auto pl-[195px] pr-28 pt-[9px] pb-[3px] box-border  bg-teal-500" dir="rtl">
      <div className=" flex flex-col justify-start items-start h-[100%] box-border">
        <div className=" flex flex-row justify-start items-start gap-2.5 w-[100%] h-[100%] box-border">
          <div className=" flex flex-row justify-start items-start  gap-[30px] h-[100%] box-border">
            <div className=" flex flex-row justify-start items-center gap-2.5 h-[100%] box-border">
              <div className=" flex flex-row justify-start items-center  gap-[5px] h-auto p-2.5 rounded-[5px] box-border">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/tcsh9dz9mz-2787%3A1720?alt=media&token=b2e077a7-b48d-4c77-ab44-31627eb9e744"
                  alt="Not Found"
                  className=" w-4 h-[100%]"
                />
                <p className="  border-[#ffffffff] text-xs text-white   leading-[133%]  font-montserrat  font-[400]  tracking-[0.2px]">
                  (225) 555-0118
                </p>
              </div>
              <div className=" flex flex-row justify-start items-center  gap-[5px] h-auto p-2.5 rounded-[5px] box-border">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/tcsh9dz9mz-2787%3A1724?alt=media&token=5dffbae3-248e-479b-8630-a2062b03d64c"
                  alt="Not Found"
                  className=" w-4 h-[100%]"
                />
                <p className="  border-[#ffffffff] text-xs  text-white  leading-[133%]  font-montserrat  font-[400]  tracking-[0.2px]">
                  michelle.rivera@example.com
                </p>
              </div>
            </div>
            <div className=" flex flex-row justify-start items-start gap-2.5 h-[undefinedundefined] p-2.5 box-border">
              <p className="  border-[#ffffffff] text-sm text-white  leading-[171%]  font-montserrat  font-[700]  tracking-[0.2px]">
                Follow Us and get a chance to win 80% off
              </p>
            </div>
            <div className=" flex flex-row justify-start items-start gap-2.5 h-[100%] p-2.5 box-border">
              <p className="  border-[#ffffffff] text-sm text-white   leading-[171%]  font-montserrat  font-[700]  tracking-[0.2px]">
                Follow Us :
              </p>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/tcsh9dz9mz-2787%3A1731?alt=media&token=b3052348-88b8-465e-a8fd-9cdb601e0bdc"
                alt="Not Found"
                className=" w-[120px] h-[100%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default NavbarDark