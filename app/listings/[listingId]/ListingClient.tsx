'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { categories } from '@/app/components/navbar/Categories';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import React from 'react';
import ListingHead from '@/app/api/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays, eachDayOfInterval, format, isSameDay, addHours, parseISO } from 'date-fns';
import ListingReservation from '@/app/components/listings/ListingReservation';
import { Range } from 'react-date-range';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

// Available time slots (24-hour format)
const availableTimeSlots = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  // State for time selection
  const [startTime, setStartTime] = useState<string>("13:00"); // Default 1:00 PM
  const [endTime, setEndTime] = useState<string>("16:00");     // Default 4:00 PM
  
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  // Function to check if a time slot is available on a specific date
  const isTimeSlotAvailable = useCallback((date: Date, timeSlot: string) => {
    if (!date) return false;
    
    // Format to get hours and minutes as numbers
    const [hours, minutes] = timeSlot.split(':').map(Number);
    
    // Create a new date with the selected time
    const timeDate = new Date(date);
    timeDate.setHours(hours, minutes, 0, 0);
    
    // Check against all reservations
    for (const reservation of reservations) {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      
      // If the time is between any reservation's start and end time, it's not available
      if (timeDate >= startDate && timeDate <= endDate) {
        return false;
      }
    }
    
    return true;
  }, [reservations]);

  // Get available time slots for the selected date
  const getAvailableTimeSlots = useCallback((date: Date) => {
    if (!date) return [];
    return availableTimeSlots.filter(slot => isTimeSlotAvailable(date, slot.value));
  }, [isTimeSlotAvailable]);

  // State for available times based on selected date
  const [availableStartTimes, setAvailableStartTimes] = useState<typeof availableTimeSlots>([]);
  const [availableEndTimes, setAvailableEndTimes] = useState<typeof availableTimeSlots>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  // Update available time slots when date changes
  useEffect(() => {
    if (dateRange.startDate) {
      const availableTimes = getAvailableTimeSlots(dateRange.startDate);
      setAvailableStartTimes(availableTimes);
      
      // Reset time selections when date changes
      if (availableTimes.length > 0) {
        setStartTime(availableTimes[0].value);
      }
    }
  }, [dateRange.startDate, getAvailableTimeSlots]);

  // Update end time options when start time changes
  useEffect(() => {
    if (dateRange.startDate && startTime) {
      const startHour = parseInt(startTime.split(':')[0], 10);
      
      // Filter times that are after the start time
      const availableEnds = availableTimeSlots.filter(slot => {
        const slotHour = parseInt(slot.value.split(':')[0], 10);
        return slotHour > startHour;
      });
      
      setAvailableEndTimes(availableEnds);
      
      // Set a default end time (2 hours after start or the next available)
      if (availableEnds.length > 0) {
        const twoHoursLater = availableTimeSlots.find(
          slot => parseInt(slot.value.split(':')[0], 10) === startHour + 2
        );
        
        setEndTime(twoHoursLater?.value || availableEnds[0].value);
      }
    }
  }, [dateRange.startDate, startTime]);

  // Create a combined datetime for the reservation

const createDateTime = useCallback((date: Date, timeStr: string) => {
  if (!date) return null;
  
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  } catch (error) {
    console.error('Error creating datetime:', error);
    return null;
  }
}, []);
  // In ListingClient.tsx, modify the onCreateReservation function:


  
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
  
    if (!dateRange.startDate || !startTime || !endTime) {
      toast.error('Please select date and time');
      return;
    }
  
    // Validate total price
    if (!totalPrice || totalPrice <= 0) {
      toast.error('Invalid price calculation. Please try again or select different times.');
      return;
    }
  
    setIsLoading(true);
  
    // Create full datetime objects
    const startDateTime = createDateTime(dateRange.startDate, startTime);
    const endDateTime = createDateTime(dateRange.startDate, endTime);
  
    if (!startDateTime || !endDateTime) {
      toast.error('Invalid date/time selection');
      setIsLoading(false);
      return;
    }
  
    // Ensure end time is after start time
    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      setIsLoading(false);
      return;
    }
  
    const payload = {
      listingId: listing.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      totalPrice: totalPrice
    };
  
    console.log('Sending reservation payload:', payload);
  
    axios
      .post('/api/reservations', payload)
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        router.push('/trips');
      })
      .catch((error) => {
        let errorMessage = error.response?.data?.error || 'Something went wrong';
        toast.error(errorMessage);
        console.error('Reservation error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, startTime, endTime, listing?.id, router, currentUser, loginModal, createDateTime]);

  // Calculate price based on duration in hours
useEffect(() => {
  if (dateRange.startDate && startTime && endTime) {
    const startDateTime = createDateTime(dateRange.startDate, startTime);
    const endDateTime = createDateTime(dateRange.startDate, endTime);
    
    if (!startDateTime || !endDateTime) {
      console.error('Invalid date/time objects');
      return;
    }
    
    // Calculate hours difference
    const hoursDiff = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    
    // Ensure we have a positive time difference
    if (hoursDiff <= 0) {
      console.error('End time must be after start time');
      setTotalPrice(0);
      return;
    }
    
    // Calculate total price (ensure it's a positive number)
    if (listing.price) {
      // Hourly rate (assuming listing.price is per day, divide by 8 for hourly)
      const hourlyRate = Math.max(1, listing.price / 8); // Minimum $1 per hour
      const calculatedPrice = Math.round(hoursDiff * hourlyRate);
      setTotalPrice(Math.max(1, calculatedPrice)); // Ensure minimum $1 total
      
      console.log('Price calculation:', {
        hoursDiff,
        hourlyRate,
        calculatedPrice,
        finalPrice: Math.max(1, calculatedPrice)
      });
    } else {
      setTotalPrice(listing.price || 0);
    }
  }
}, [dateRange, startTime, endTime, listing.price, createDateTime]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-6">
        <ListingHead
          title={listing.title}
          imageSrc={listing.imageSrc}
          locationValue={listing.locationValue}
          id={listing.id}
          currentUser={currentUser}
        />
        <div className="grid grid-col-1 md:grid-cols-7 md:gap-10 mt-6">
          <ListingInfo
            user={listing.user}
            category={category}
            description={listing.description}
            roomCount={listing.roomCount}
            guestCount={listing.guestCount}
            bathroomCount={listing.bathroomCount}
            locationValue={listing.locationValue}
          />
          <div className="order-first mb-10 md:order-last md:col-span-3">
            <ListingReservation
              price={listing.price}
              totalPrice={totalPrice}
              onChangeDate={(value) => setDateRange(value)}
              dateRange={dateRange}
              onSubmit={onCreateReservation}
              disabled={isLoading}
              disabledDates={disabledDates}
              // Pass the new time selection props
              startTime={startTime}
              endTime={endTime}
              onChangeStartTime={setStartTime}
              onChangeEndTime={setEndTime}
              availableStartTimes={availableStartTimes}
              availableEndTimes={availableEndTimes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingClient;
































