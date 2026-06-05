/**
 * @file Initalizes the calendar
 * 
 * @author Ali Izoyev
 * @version 1.0.0
 * @module calendar.js
 */

let calendar;

// Make these variables for later use
let dateRangeSelected = new Map(); // Map for applying the rows into dates
let isCreatingSchedule = false;
let set = new Set(); // Set for checking if a date in the calendar is between a specific week the user chooses

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
        firstDay: 1,
        eventOrder: "-type",
    
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
            // If we are not creating a schedule, use the mouse short cuts
            if (!isCreatingSchedule)
            {
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

                
            }
            else // Else, we are and make a start and end Date object
            {
                // Get the start date and end date
                const start = new Date(info.date);
                const end = new Date(info.date);
                console.log(start);

                // Set the end date to last day of the week
                end.setDate(end.getDate() + 6)

                // Make a current date to get all dates between start and end
                const current = new Date(start);

                // Get all dates between the start and end dates and put them into the set
                while (current <= end)
                {
                    set.add(new Date(current).toDateString());

                    current.setDate(current.getDate() + 1);    
                }

                // Add both to map and render the calendar
                dateRangeSelected.set(start, end)
                calendar.render();    
            }   
        },
        
        // Runs when the calendar renders, view changes, etc.
        dayCellClassNames(info)
        {
        
        // Using the set, return the class if the date is within the set
        return set.has(info.date.toDateString()) ? ["selected-week"] : []

        }
    })
    

// Renders the calendar
calendar.render();

// Using right mouse for calendar view modes (short cut)
document.querySelector("#calendar > :nth-child(2)").addEventListener("contextmenu", (event) =>
{
    if (!isCreatingSchedule)
    {
        if (event.button === 2)
        {
            event.preventDefault();

            if (calendar.view.type === "timeGridDay")
            {
                calendar.changeView("dayGridWeek");  
            }
            else if (calendar.view.type === "dayGridWeek")
            {
                calendar.changeView("dayGridMonth");  
            }
            else if (calendar.view.type === "dayGridMonth")
            {
                calendar.changeView("multiMonthYear");  
            }  
        }
    }   
})
})

/*
// if we are creating a schedule
        if (isCreatingSchedule)
        {
            // Get all of the dates on screen
            const current = new Date(info.date);

            // Run a for-each loop on the map
            for (const [startDate, endDate] of dateRangeSelected)
            {
                // If the current date is within the week, return the class
                if (current >= startDate && current <= endDate)
                {
                    return ["selected-week"]
                }
            }
            // Else, was not in the week and return nothing
            return [];
        }
        
        // Return nothing
        return []
        
        }
*/




