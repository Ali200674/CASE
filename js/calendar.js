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
            end: "timeGridDay dayGridWeek dayGridMonth dayGridYear multiMonthYear"  
        },
       
        // Change the button text of the view modes
        buttonText:
        {
            timeGridDay: "Day View",
            dayGridWeek: "Week View",
            dayGridMonth: "Month View",
            dayGridYear: "Year View",
            multiMonthYear: "Overview"
        },


        // Function of when a cell is clicked, it will switch to the day view of what was clicked on
        dateClick: function(info)
        {
            // If we are not creating a schedule, use the mouse short cuts
            if (!isCreatingSchedule)
            {
                if (calendar.view.type === "multiMonthYear")
                {
                    calendar.changeView("dayGridYear", info.dateStr);  
                }
                else if (calendar.view.type === "dayGridYear")
                {
                    calendar.changeView("dayGridMonth", info.dateStr)  
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
       
        // // Using the set, return the class if the date is within the set
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
            else if (this.calendar.view.type === "dayGridWeek")
            {
                 calendar.changeView("dayGridMonth");  
            }
            else if (this.calendar.view.type === "dayGridMonth")
            {
                calendar.changeView("dayGridYear")
            }
            else if (calendar.view.type === "dayGridYear")
            {
                calendar.changeView("multiMonthYear");  
            }  
        }
    }  
})


let startDate = document.querySelector("#campaign-start");
let endDate = document.querySelector("#campaign-end");

function updateDateRange()
{
    calendar.setOption("validRange", {
        start: startDate.value || undefined,
        end: endDate.value || undefined
    })
}


startDate.addEventListener("change", updateDateRange);
endDate.addEventListener("change", updateDateRange)


// For the cancel button at bottom.
document.querySelector("#cancel").addEventListener("click", () =>
{
    isCreatingSchedule = false;

    dateRangeSelected.clear();
    set.clear();


    calendar.setOption("weekNumbers", false)
   
    closestTable = null;
    closestStationName = null;
})

// Add an event listener to the button at the bottom of calendar
document.querySelector("#confirm").addEventListener("click",() => {
    // If we are creating the schedule
    if (isCreatingSchedule)
    {
        // Get all rows of table and make array
        const rows = closestTable.querySelectorAll("tr");

        const textareas = []

        // If the rows contain a textarea, add it to array
        for (let i = 0; i < rows.length - 2; i++)
        {
            if (rows[i].querySelector("textarea"))
            {
                textareas.push(rows[i].querySelector("textarea"))            
            }
        }

        // Make index variable
        let index = 0;

        // For each textarea
        for (let i = 0; i < textareas.length; i++)
        {
            // Go through the map
            for (const [start, end] of dateRangeSelected)
            {
                // Get the text area row from the array and add it to the calendar
                const textarea = textareas[i];

                // Make a temp date that actually includes the last date
                const actualEnd = new Date(end);
                actualEnd.setDate(actualEnd.getDate() + 1)

                calendar.addEvent({
                    title: closestStationName.value + ": " + textarea.value,
                    start: start.toISOString(),
                    end: actualEnd.toISOString(),
                    color: closestColorPicker.value,
                    allDay: true,
                })

                index++;
            }

        }

        // Reset all of these
        isCreatingSchedule = false;
        dateRangeSelected.clear();
        set.clear();
        calendar.setOption("weekNumbers", false)
        closestTable = null;
        closestStationName = null;
    }
}) 
})


