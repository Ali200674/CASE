
// This makes an event listener for the calendar
document.addEventListener("DOMContentLoaded", function(){

    // Get the div that will contain the calendar and make a new object based on this div
    let calendarEle = document.querySelector("#calendar");
    let calendar = new FullCalendar.Calendar(calendarEle, {
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
            end: "dayGridWeek timeGridDay dayGridMonth multiMonthYear"   
        },

    })

    // Renders the calendar
    calendar.render();
})

