/**
 * @file Initalizes the calendar
 * 
 * @author Ali Izoyev
 * @version 1.0.0
 * @module calendar.js
 */

let calendar;

document.addEventListener("DOMContentLoaded", function() {
    calendar = new ScheduleCalendar();
})

class ScheduleCalendar
{
    // VARIABLES
    #calendar = null;

    // Data structures (Map and Set)
    #dateRangeSelected = null;
    #daysInSelectedWeek = null;

    // Boolean
    #isCreatingSchedule = false;

    // Others
    #rightMouse = null;
    #cancelButton = null;
    #confirmButton = null;
    #tableInfoDiv = null;
    
    
    /**
     * Creates a new P48Schedule instance and initializes calendar state,
     * event handlers and UI elements. 
     */
    constructor()
    {
        this.#dateRangeSelected = new Map();
        this.#daysInSelectedWeek = new Set();
        this.#tableInfoDiv = document.querySelector("#table-info");

        this.#initializeCalendar();
        this.#setupRightMouseHandler()
        this.#setupConfirmButton();
        this.#setupCancelButton();
    }

    // Method for initializing the calendar
    #initializeCalendar() 
    {
        let calendarEle = document.querySelector("#calendar");
            this.#calendar = new FullCalendar.Calendar(calendarEle, {
                // Some of these are easy to explain
                initialView: "dayGridMonth",
                editable: true,
                droppable: true,
                selectable: true,
                firstDay: 1,
                eventOrder: "-type",  

                headerToolbar: this.#initializeToolBar(),
                buttonText: this.#changeViewModeText(),
                dateClick: (info) => this.#initializeDateClick(info),
                dayCellClassNames: (info) => this.#initializeDayCellClassNames(info),
                eventClick: this.#initializeEventClick
        })

       this.#calendar.render();
    }

    // PRIVATE METHODS

    // Method for event clicking
    #initializeEventClick(eventClickInfo)
    {
        //activeEventsMap.get(eventClickInfo.event.id).tableElement.parentElement.parentElement.scrollIntoView();
        const checkSectionDiv = document.querySelector(".check-section");
        const overlay = document.querySelector(".overlay");
        const checkSectionText = document.querySelector(".check-section").querySelector("p");
        checkSectionDiv.style.display = "block";
        overlay.style.display = "block";
        checkSectionText.innerHTML = eventClickInfo.event.extendedProps.description;
        //return this.#tableInfoDiv.innerHTML = eventClickInfo.event.extendedProps.description;
    }

    // Method for tool bar
    #initializeToolBar() 
    {
        // For more option, look at the docs
        return {
            start: "prev next today",
            center: "title",
            end: "timeGridDay dayGridWeek dayGridMonth dayGridYear multiMonthYear"  
        }
    }

    // Method for view modes
    #changeViewModeText() 
    {
        // Change the button text of the view modes
        return {
            timeGridDay: "Day View",
            dayGridWeek: "Week View",
            dayGridMonth: "Month View",
            dayGridYear: "Year View",
            multiMonthYear: "Overview"
        }
    }

    // Left mouse clicking method 
    #initializeDateClick(info)
    {
        // If we are not creating a schedule, use the mouse short cuts
        if (!this.#isCreatingSchedule)
        {
            if (this.#calendar.view.type === "multiMonthYear")
            {
                this.#calendar.changeView("dayGridYear", info.dateStr);  
            }
            else if (this.#calendar.view.type === "dayGridYear")
            {
                this.#calendar.changeView("dayGridMonth", info.dateStr)
            }
            else if (this.#calendar.view.type === "dayGridMonth")
            {
                this.#calendar.changeView("dayGridWeek", info.dateStr);  
            }
            else if (this.#calendar.view.type === "dayGridWeek")
            {
                this.#calendar.changeView("timeGridDay", info.dateStr);  
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
                this.#daysInSelectedWeek.add(new Date(current).toDateString());
                
                current.setDate(current.getDate() + 1);    
            }

            // Add both to map and render the calendar
            this.#dateRangeSelected.set(start, end)
            this.#calendar.render();
        }  
    }

    // Method for if there is the selected day in the set
    #initializeDayCellClassNames(info)
    {
        return this.#daysInSelectedWeek.has(info.date.toDateString()) ? "selected-week" : ""
    }

    // // Using right mouse for calendar view modes (short cut)
    #setupRightMouseHandler()
    {
        this.#rightMouse = document.querySelector("#calendar > :nth-child(2)")
        
        this.#rightMouse.addEventListener("contextmenu", (event) =>
        {
            if (!this.#isCreatingSchedule)
            {
                if (event.button === 2)
                {
                    event.preventDefault();

                    if (this.#calendar.view.type === "timeGridDay")
                    {
                        this.changeViewMode("dayGridWeek");  
                    }
                    else if (this.#calendar.view.type === "dayGridWeek")
                    {
                        this.changeViewMode("dayGridMonth");  
                    }
                    else if (this.#calendar.view.type === "dayGridMonth")
                    {
                        this.changeViewMode("dayGridYear"); 
                    }
                    else if (this.#calendar.view.type === "dayGridYear")
                    {
                        this.changeViewMode("multiMonthYear");  
                    }  
                }
            }  
        })
    }

    // To set all variables and set the mode to not creating events
    #resetCalendar()
    {
        this.setIsCreatingSchedule(false);

        this.#dateRangeSelected.clear();
        this.#daysInSelectedWeek.clear();

        this.setOptionForCalendar("weekNumbers", false);

        closestTable = null;
        closestStationName = null;
    }

    // When user clicks confirm button
    #setupConfirmButton()
    {
        this.#confirmButton = document.querySelector("#confirm");
        this.#confirmButton.addEventListener("click", () =>
        {
            // If we are creating the schedule
            if (this.#isCreatingSchedule)
            {
                // Get all rows of table and make array
                const rows = closestTable.querySelectorAll("tr > td:first-child");

                const textareas = []

                // If the rows contain a textarea, add it to array
                for (let i = 0; i < rows.length - 2; i++)
                {
                    if (rows[i].querySelector("textarea"))
                    {
                        textareas.push(rows[i].querySelector("textarea")); 
                    }
                }

                // Make index variable
                let index = 0;

                // Make variable told hold each row text
                let rowsText = "";

                // For each textarea
                for (let i = 0; i < textareas.length; i++)
                {
                    rowsText += textareas[i].value + "<br>";
                }

                // Go through the map
                for (const [start, end] of this.#dateRangeSelected)
                {
                    // Get the text area row from the array and add it to the calendar
                    // const textarea = textareas[i];

                    // Make a temp date that actually includes the last date
                    const actualEnd = new Date(end);
                    actualEnd.setDate(actualEnd.getDate() + 1)

                    let event = this.createEventBlock(
                        closestStationName.value + ": " + closestTableName.value,
                        start,
                        actualEnd,
                        closestColorPicker.value,
                        true,
                        rowsText
                    )

                    let tableInstance = activeScheduleTables.get(closestTable.parentElement);
                    activeEventsMap.set(event.id, tableInstance);
                    tableInstance.events.add(event);
                    index++;
                }

                this.#resetCalendar()
            }
        })
    }

    // When user clicks cancel
    #setupCancelButton()
    {
        this.#cancelButton = document.querySelector("#cancel")
        this.#cancelButton.addEventListener("click", () => this.#resetCalendar())
    }

    // Code is commented for now
    #changeCalendarDateRange()
    {
        // let startDate = document.querySelector("#campaign-start");
        // let endDate = document.querySelector("#campaign-end");

        // function updateDateRange()
        // {
        //     calendar.setOption("validRange", {
        //         start: startDate.value || undefined,
        //         end: endDate.value || undefined
        //     })
        // }


        // startDate.addEventListener("change", updateDateRange);
        // endDate.addEventListener("change", updateDateRange)
    }

    // UUID generation magic that doesn't require a secure context
    #generateEventUUID()
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // PUBLIC METHODS
    /**
     * Changes an option of the calendar after initialization. 
     * 
     * This method takes in two parameters. The first parameter is the name of 
     * the calendar option that you want to change. The second option is to 
     * what you want to change it to. 
     * 
     * @param {string} optionName The calendar option you want to change
     * @param {*} value The value you want to assign the first parameter
     */
    setOptionForCalendar(optionName, value)
    {
        this.#calendar.setOption(optionName, value)
    }

    /**
     * Changes the view mode of the calendar after initialization.
     * 
     * This method takes in one parameter. That parameter is the view mode you want
     * the calendar to show.
     *  
     * There is a list of view modes that work for this calendar.
     * Some of those include timeGridDay dayGridWeek dayGridMonth dayGridYear multiMonthYear
     * 
     * @param {string} mode The view mode the calendar switches to
     * @throws {Error} Throws if the value passed is not a string 
     */
    changeViewMode(mode)
    {
        if (typeof mode !== "string") {throw new Error("Value passed is not a string")}

        this.#calendar.changeView(mode);
    }

    /**
     * Sets the isCreatingSchedule boolean to the value given.
     * 
     * Only works with boolean, nothing else.
     * 
     * @param {boolean} bool The value the isCreatingSchedule will be set to.
     * @throws {Error} Throws if the value passed is not a boolean 
     */
    setIsCreatingSchedule(bool)
    {
        if (typeof bool !== "boolean") {throw new Error("Value given is not boolean.")}

        this.#isCreatingSchedule = bool;
    }

    /**
     * Returns whether the client is making a schedule
     * 
     * @returns {boolean} True if the client is making a schedule. Otherwise false.
     */
    getIsCreatingSchedule()
    {
        return this.#isCreatingSchedule;
    }

    /**
     * Creates an event block and places it on the calendar.
     * 
     * There are a lot of parameters that can be passed through.
     * 
     * If a specific parameter is not wanted, simply pass in undefined to give a default
     * value for that parameter. Default values are explained in each parameter description
     * 
     * This method requires at least a two Date objects for the event
     * to be placed in the calendar. If either or both is not passed, It will throw an error
     *  
     * @param {string} titleEvent The title of the event. If none is given, the title will be "Event"
     * @param {Date} startDate A Date object that represents the start of the event. 
     * @param {Date} endDate A Date object that represents the end of the event
     * @param {string} color A color for the event as a string. An input type color element with .value property will also work. if none is given, it will default to a blue color (#3788d8)
     * @param {boolean} allDay A boolean if the event will be all day or not, if the boolean is not true, it will default to false and the time will be 1 hour 
     * @param {string} descriptionOfEvent A description of the event. If none is given, it will default to a empty string
     * @returns A FullCalendar Event object representing the event that was added
     * @throws {Error} If the start and endDate variables are null or if they are not an instance of Date
     */
    createEventBlock(titleEvent, startDate, endDate, color, allDay, descriptionOfEvent)
    {
        if (startDate == null || !(startDate instanceof Date) ) {throw new Error("The start date is not a Date object or is null")}
        if (endDate == null || !(endDate instanceof Date)) {throw new Error("The end date is not a Date object or is null")}

        return this.#calendar.addEvent({
            title: titleEvent ?? "Event",
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            color: color ?? "#3788d8",
            allDay: allDay ?? false,
            id: this.#generateEventUUID(),
            extendedProps:
            {
                description: descriptionOfEvent ?? ""
            }
        })
    }
}




