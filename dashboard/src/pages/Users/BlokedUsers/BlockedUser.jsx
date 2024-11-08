import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaStop } from "react-icons/fa6";
import { MdBlockFlipped } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";

function BlockedUser() {
  return (
    <>
         <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>اسم المستخدم</th>
              <th>الايمل</th>
              <th>رقم الهاتف</th>
              <th>تاريخ الاضافة</th>
              <th>ناريخ التعديل</th>
              <th>من قبل</th>
              <th>اجراء</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td> zakaria </td>
              <td> zakaria@gmail.com </td>
              <td> 0924167849 </td>

              <td>4-2-2024</td>
              <td>4-4-2024</td>
              <td>زكريا ساسي</td>
              <td className="flex gap-3">
                
                <IoCheckmark className="h-5 w-4 cursor-pointer text-green-500 hover:text-green-400" />

          
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    
    </>
  )
}

export default BlockedUser