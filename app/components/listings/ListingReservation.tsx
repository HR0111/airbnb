// 'use client';

// import { Range } from 'react-date-range';
// import Calendar from '../inputs/Calendar';
// import Button from '../Button';
// import { format } from 'date-fns';

// interface ListingReservationProps {
//   price: number;
//   dateRange: Range;
//   totalPrice: number;
//   onChangeDate: (value: Range) => void;
//   onSubmit: () => void;
//   disabled?: boolean;
//   disabledDates: Date[];
//   // New props for time selection
//   startTime: string;
//   endTime: string;
//   onChangeStartTime: (time: string) => void;
//   onChangeEndTime: (time: string) => void;
//   availableStartTimes: Array<{ value: string; label: string }>;
//   availableEndTimes: Array<{ value: string; label: string }>;
// }

// const ListingReservation: React.FC<ListingReservationProps> = ({
//   price,
//   dateRange,
//   totalPrice,
//   onChangeDate,
//   onSubmit,
//   disabled,
//   disabledDates,
//   startTime,
//   endTime,
//   onChangeStartTime,
//   onChangeEndTime,
//   availableStartTimes,
//   availableEndTimes
// }) => {
//   return (
//     <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
//       <div className="flex flex-row items-center gap-1 p-4">
//         <div className="text-2xl font-semibold">$ {price}</div>
//         <div className="font-light text-neutral-600">/ hour</div>
//       </div>
//       <hr />
//       <Calendar
//         value={dateRange}
//         disabledDates={disabledDates}
//         onChange={(value) => onChangeDate(value.selection)}
//       />
//       <hr />
      
//       {/* Time selection */}
//       <div className="p-4">
//         <h3 className="text-lg font-semibold mb-2">Select time</h3>
//         <div className="flex flex-col gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Start Time
//             </label>
//             <select
//               value={startTime}
//               onChange={(e) => onChangeStartTime(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               disabled={availableStartTimes.length === 0}
//             >
//               {availableStartTimes.length > 0 ? (
//                 availableStartTimes.map((time) => (
//                   <option key={time.value} value={time.value}>
//                     {time.label}
//                   </option>
//                 ))
//               ) : (
//                 <option value="">No available times</option>
//               )}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               End Time
//             </label>
//             <select
//               value={endTime}
//               onChange={(e) => onChangeEndTime(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               disabled={availableEndTimes.length === 0}
//             >
//               {availableEndTimes.length > 0 ? (
//                 availableEndTimes.map((time) => (
//                   <option key={time.value} value={time.value}>
//                     {time.label}
//                   </option>
//                 ))
//               ) : (
//                 <option value="">No available times</option>
//               )}
//             </select>
//           </div>
//         </div>
//       </div>
//       <hr />
      
//       <div className="p-4">
//         <Button 
//           disabled={disabled || availableStartTimes.length === 0} 
//           label="Reserve" 
//           onClick={onSubmit}
//         />
//       </div>
//       <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
//         <div>Total</div>
//         <div>$ {totalPrice}</div>
//       </div>
      
//       {dateRange.startDate && (
//         <div className="p-4 bg-neutral-50">
//           <p className="text-sm text-neutral-800">
//             {format(dateRange.startDate, 'PPP')} {' '}
//             <span className="font-medium">
//               {startTime && endTime ? `${format(dateRange.startDate, 'PPP')} from ${startTime.replace(':', ':')} to ${endTime.replace(':', ':')}` : 'Select times'}
//             </span>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListingReservation;






'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';
import { format } from 'date-fns';

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  // New props for time selection
  startTime: string;
  endTime: string;
  onChangeStartTime: (time: string) => void;
  onChangeEndTime: (time: string) => void;
  availableStartTimes: Array<{ value: string; label: string }>;
  availableEndTimes: Array<{ value: string; label: string }>;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  startTime,
  endTime,
  onChangeStartTime,
  onChangeEndTime,
  availableStartTimes,
  availableEndTimes
}) => {
      
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">/ hour</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />

      {dateRange.endDate?.getDate() == dateRange.startDate?.getDate() &&
        
        (<>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Select time</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <select
              value={startTime}
              onChange={(e) => onChangeStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={availableStartTimes.length === 0}
            >
              {availableStartTimes.length > 0 ? (
                availableStartTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))
              ) : (
                <option value="">No available times</option>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <select
              value={endTime}
              onChange={(e) => onChangeEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={availableEndTimes.length === 0}
            >
              {availableEndTimes.length > 0 ? (
                availableEndTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))
              ) : (
                <option value="">No available times</option>
              )}
            </select>
          </div>
        </div>
      </div>
      <hr /></>
        )}
      
      
      <div className="p-4">
        <Button 
          disabled={disabled || availableStartTimes.length === 0} 
          label="Reserve" 
          onClick={onSubmit}
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
      
      {dateRange.startDate && (
        <div className="p-4 bg-neutral-50">
          <p className="text-sm text-neutral-800">
            {format(dateRange.startDate, 'PPP')} {' '}
            <span className="font-medium">
              {startTime && endTime ? `${format(dateRange.startDate, 'PPP')} from ${startTime.replace(':', ':')} to ${endTime.replace(':', ':')}` : 'Select times'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingReservation;