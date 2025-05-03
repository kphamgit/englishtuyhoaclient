import Popup from "reactjs-popup";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'


interface PopupButtonProps {
  buttonLabel: string;
  children: React.ReactNode;
}

const ModalPopup: React.FC<PopupButtonProps> = ({ buttonLabel, children }) => {
   
        const [isOpen, setIsOpen] = useState(false);
       

    return (
           <div className="flex justify-center items-center ">
             <button
               onClick={() => setIsOpen(true)}
               className="px-4 py-2 bg-blue-500 text-white rounded"
             >
               {buttonLabel}
             </button>
       
             <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)} modal>
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                 <div className="bg-white p-1 rounded-lg shadow-lg">
                   
                   <div>{children}</div>
                   
                   {/* Add your content here  onClick={() => setIsOpen(false)} */}
                   <button
                     onClick={() => {setIsOpen(false)}}
                     className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                   >
                     Close {buttonLabel}
                   </button>
                 </div>
               </div>
             </Popup>
           </div>
         );
}

export default ModalPopup;

/*
 return (
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
           {buttonLabel}
          </button>
    
       
            <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)} modal>
            <h2 className="text-green-600 bg-white text-lg font-bold mb-4">{buttonLabel}</h2>
                        <div className="bg-yellow-200">{children}</div>

                   
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
        
            </Popup>
        </div>
        
      );
*/
