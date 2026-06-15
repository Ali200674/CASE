/**
 * @file Contains functions for handling events.
 * 
 * @author Ali Izoyev
 * @author Colin Rice
 * @version 1.0.0
 * @module events.js
 */


function handleExpensiveInputEventForSchedules(event)
{
    let tableElement = event.target.parentElement.nextElementSibling;
    let table = activeScheduleTables.get(tableElement);

    if (event.target.type == "color") {
        // Update calendar events with the new color
        for (const eventId of table.events) {
            calendar.getEventById(eventId).setProp("color", event.target.value);
        }
    } else if (event.target.className.includes("table-name")) {
        // Update calendar events with the new table name
        for (const eventId of table.events) {
            calendar.getEventById(eventId).setProp("title", event.target.closest(".section").querySelector(".client-name").value + ": " + event.target.value);
        }
    }
}

/**
 * Handles input events from schedule tables.
 *
 * @param {HTMLElement} event The event context
 */
function handleInputEventForSchedules(event)
{
    let tableElement = event.target.closest("table");
    let table = activeScheduleTables.get(tableElement);
    let parentRow = event.target.closest("tr");

    // If the target is a daypart
    if (event.target.className.includes("daypart-input"))
    {
        // Update the table's rowHeadings with the value
        table.rowHeadings[parentRow.rowIndex - 1] = event.target.value;
        console.log(table.rowHeadings);
    } else {
        // Turn the value into a float
        const value = parseFloat(event.target.value);

        // if the value is negative and is not NaN
        if (!isNaN(value) && value < 0)
        {
            event.target.value = 0;
        }
        table.getAllTotals();
    }
}

/**
 * Ignore '-' in input fields when typing
 * 
 * @param {HTMLElement} event The element (input elements) that are being listened to for inputs
 */
function handleKeyDownEventForSchedules(event)
{
    if ( event.key === "-" && event.target.tagName === "INPUT" && !event.target.className.includes("daypart"))
    {
        event.preventDefault();
    }
}

/**
 * Ignore '-' in input fields when pasting
 * 
 * @param {HTMLElement} event The element (input elements) that are being listened to for inputs
 */
function handlePasteEventForSchedules(event)
{
    const pastedNum = event.clipboardData.getData("text")

    if (pastedNum.includes("-") && !event.target.className.includes("daypart"))
    {
        event.preventDefault();
    }
}

/**
 * Show different input fields based on the chosen schedule type
 * 
 * @param {HTMLElement} event The element (input elements) 
 */
function handleChangeEventForScheduleTypes(event)
{
    // Find the closest tag that has this class (schedule selection)
    const closestSchedule = event.target.closest(".generate-new-schedule");

    // Get the week, month, and error message
    const weekSelection = closestSchedule.querySelector(".week-selection");
    const monthSelection = closestSchedule.querySelector(".month-selection");
    const errorMessage = closestSchedule.querySelector(".error-message")

    // if the user chooses week
    if (event.target.value === "week")
    {
        // Show the week and hide the month and error message (if still there)
        weekSelection.style.display = "flex";
        monthSelection.style.display = "none";
        errorMessage.style.display = "none";
    }
    else // Else (month is showing instead)
    {
        // Hide week and error message (if still there) and show month
        weekSelection.style.display = "none";
        monthSelection.style.display = "block";
        errorMessage.style.display = "none";
    }
}


/**
 * Creates a new schedule based on the user's selected date
 * 
 * @param {HTMLButtonElement} event The button labeled "Generat New Schedule" 
 */
function handleCreateNewSchedule(event)
{
    
    // // Get the button
    const getTarget = event.target;

    // Get the closest tag with ".generate-new-schedule" class
    const getClosestSchedule = getTarget.closest(".generate-new-schedule");

    // // Within that tag, find all of these classes
    // This will be commented out. 
    // const weekSelection = getClosestSchedule.querySelector(".week-selection")
    // const weekOf = getClosestSchedule.querySelector(".week-of")
    // const errorMessage = getClosestSchedule.querySelector(".error-message")
    // const monthChoosen = getClosestSchedule.querySelector(".month-choosen")
    // const monthSelection = getClosestSchedule.querySelector(".month-selection")

    // // All of these are for the closest tag with the ".generate-new-schedule" class. 
    // // If week is showing
    // if (weekSelection.style.display === "flex")
    // {
    //     // If either are null
    //     if (weekOf.value === "") 
    //     { 
    //         // Show error message and stop button
    //         errorMessage.style.display = "block";
    //         return; 
    //     }
    //     else // Else, both are not null and don't show message
    //     {
    //         errorMessage.style.display = "none"; 
    //     } 
    // }

    // // If month is showing
    // if (monthSelection.style.display === "block")
    // {
    //     // If month is null
    //     if (monthChoosen.valueAsDate === null) 
    //     {
    //         // Show error and stop
    //         errorMessage.style.display = "block";
    //         return; 
    //     }
    //     else // Else, not null and don't show message
    //     {
    //         errorMessage.style.display = "none";
    //     }
    // }

    const tempDates = ["2", "2"]
    // const dateRangeArray = getScheduleDate(getClosestSchedule, true);
    const newScheduleTable = new ScheduleTable(tempDates[0], tempDates[1]);
    // Call this function to insert the table, pass in the closest schedule
    newScheduleTable.insertTableToDOM(getClosestSchedule);
}

//add dayparts button

/**
 * Add's daypart buttons
 * 
 * @param {HTMLElement} event The row that was clicked
 */
function handleAddDaypartRow(event)
{
    // Grab the actual row that was clicked
    const addDaypartRow = event.target.closest("tr");

    // Grab the table that holds all the rows
    const tableElement = addDaypartRow.closest("table");
    const tableObject = activeScheduleTables.get(tableElement);
    const tableBody = tableElement.children[0];

    // Create a brand new tr element
    const newRow = document.createElement("tr");

    tableObject.populateRow(newRow, tableObject.height - 2, true);

    // Insert the new row ABOVE the "+ Add Daypart" row
    tableBody.insertBefore(newRow, addDaypartRow);
    // Insert the new daypart into rowHeadings
    tableObject.rowHeadings.splice(tableObject.height - 2, 0, "New Daypart")
    tableObject.height += 1;

    // Recalculate totals after adding the new row
    tableObject.getAllTotals();
}

function handleResizeDaypartTextarea(event)
{
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
}
