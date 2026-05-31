/**
 * @file Initalizes the calendar
 * 
 * @author Ali Izoyev
 * @version 1.0.0
 * @module calendar.js
 */

let calendar;

// This makes an event listener for the calendar
document.addEventListener("DOMContentLoaded", function(){

    // Get the div that will contain the calendar and make a new object based on this div
    let calendarEle = document.querySelector("#calendar");
    calendar = new FullCalendar.Calendar(calendarEle, {
        // Some of these are easy to explain
        initialView: "dayGridMonth",
        editable: true,
        droppable: true,
        selectable: true,
    
        // For more option, look at the docs
        headerToolbar:
        {
            start: "prev next today",
            center: "title",
            end: "timeGridDay dayGridWeek dayGridMonth multiMonthYear"   
        }, 

        // Function of when a cell is clicked, it will switch to the day view of what was clicked on
        dateClick: function(info)
        {
            currentInfo = info;
            if (calendar.view.type === "multiMonthYear")
            {
                calendar.changeView("dayGridMonth", info.dateStr);  
            }
            else if (calendar.view.type === "dayGridMonth")
            {
                calendar.changeView("dayGridWeek", info.dateStr);  
            }
            else if (calendar.view.type === "dayGridWeek")
            {
                calendar.changeView("timeGridDay", info.dateStr);  
            }  
        },    
    })

    // Renders the calendar
    calendar.render();
})



