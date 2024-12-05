import React from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Meeting",
    start: new Date(2024, 10, 20, 10, 0),
    end: new Date(2024, 10, 20, 11, 30),
  },
  {
    title: "Deadline",
    start: new Date(2024, 10, 22),
    end: new Date(2024, 10, 22),
  },
];

const MyCalendar = () => (
  <div
    style={{
      color: "#000",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      padding: "10px",
      boxSizing: "border-box",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        
      }}
    >
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          width: "100%",
          height: "100%",
        }}
        views={{
          month: true,
          day: true,
          agenda: true, 
        }}
        defaultView="month" 
        
      />
    </div>
  </div>
);

export default MyCalendar;