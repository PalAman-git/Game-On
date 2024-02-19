"use client";
import { useState, useEffect } from "react";

const slots = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "12:00 AM", available: true },
  { time: "01:00 AM", available: true },
  { time: "02:00 AM", available: true },
  { time: "03:00 AM", available: true },
  { time: "04:00 AM", available: true },
];

export default function page({ params }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetch(`/api/stadium/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots);
      });
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setAvailableSlots(
        slots.map((slot) => {
          const slotTime = slot.time.replace(" AM", ":00").replace(" PM", ":00");
          return {
            time: slot.time,
            available: !bookedSlots.some(
              (bookedSlot) =>
                bookedSlot.startTime === event.target.value + "T" + slotTime + ".000Z"
            ),
          };
        })
      );
  };
  
    const bookSlot = (time) => {
    fetch(`/api/stadium/book`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: params.id,
        startTime: selectedDate + "T" + time.replace(" AM", ":00").replace(" PM", ":00") + ".000Z",
        endTime: selectedDate + "T" + time.replace(" AM", ":00").replace(" PM", ":00") + ".000Z",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log('Booked for the slot')
      });
    }
  console.log(bookedSlots);
  return (
    <div className="mx-auto">
      <h1 className="text-8xl font-bold mb-4 pt-8 w-full flex justify-center">Stadium Booking</h1>
      <div className="flex items-center justify-center mb-4 mt-10">
        <label htmlFor="date" className="mr-2 text-2xl">
          Select Date:
        </label>
        <input type="date" id="date" className="text-black px-5 py-2 rounded-sm cursor-pointer" onChange={handleDateChange} />
      </div>
      {selectedDate && (
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-2xl font-semibold mb-2 mt-5">
            Available Slots at {selectedDate}
          </h2>
          <ul className="flex justify-start pl-20 mt-10 w-[85%] mx-auto flex-wrap gap-8 gap-y-10">
            {availableSlots.map((slot, index) => (
              <li key={index} className="flex items-center mb-2">
                <span className="mr-2">{slot.time}</span>
                {slot.available ? (
                  <button className="px-[6rem] font-semibold py-3 cursor-pointer transition-colors bg-green-500 hover:bg-green-700 text-white rounded-sm" onClick={()=>bookSlot(slot.time)}>
                    Book Now
                  </button>
                ) : (
                  <span className="px-[5.2rem] font-semibold py-3 text-white transition-colors bg-red-500 hover:bg-red-700 rounded-sm cursor-pointer">Not Available</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}