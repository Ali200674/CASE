/**
 * @file Contains miscellaneous utilities used throughout
 * 
 * @author Ali Izoyev
 * @author Colin Rice 
 * @version 1.0.0
 * @module utils.js
 */

/**
 * This method gets the type of schedule from whatever the user is using to add in a schedule (week or month)
 * It gets the value from whatever the user has choosen, formats it to a usable date, then returned as a string.
 * 
 * @param {HTMLElement} element In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 * @param {boolean} asJSDateRange Whether to return the schedule date as a string (for table headers) or as an array of Date objects (for table creation)
 * @returns {string | Date[]} Returns a string or array of Dates based on if the user chooses the week selection or the month selection
 */
function getScheduleDate(element, asJSDateRange = false)
{
    // Find all of the elements in that element passed
    const weekArea = element.querySelector(".week-selection");
    const weekOf = element.querySelector(".week-of");
    const monthArea = element.querySelector(".month-selection");
    const monthChoosen = element.querySelector(".month-choosen");

    // If the week is showing
    // if (weekArea.style.display === "flex")
    // {
    //     // The week picker returns something like:
    //     // "2026-W22"
    //     // Split that into:
    //     // ["2026", "22"]
    //     const splitWeek = weekOf.value.split("-W");

    //     // Grab the year and week number separately
    //     const year = parseInt(splitWeek[0]);
    //     const weekNumber = parseInt(splitWeek[1]);

    //     //Return the schedule week as a string if needed
    //     if (!asJSDateRange)
    //     {
    //         return "Week " + weekNumber + ", " + year;
    //     }
    //     // If we're returning a date range, find the start / end dates of the week
    //     // Start at Jan 1st, then move forward
    //     // by however many weeks were selected
    //     const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);

    //     //Move the date back to Monday
    //     while (startDate.getDay() !== 1)
    //     {
    //         startDate.setDate(startDate.getDate() - 1);
    //     }

    //     //End date to return is 6 days after the start
    //     let endDate = new Date(startDate)
    //     endDate.setDate(startDate.getDate() + 6);
    //     return [startDate, endDate];
    // }
    // else // Else, the month is showing instead
    // {
    //     // Make a Date object based on the value. split the value given into two strings (year and month)
    //     // Due to the indexing of the months (0 - 11 instead of 1 - 12), decrement the month by 1
    //     const selectedYear = monthChoosen.value.substring(0, 4);
    //     const selectedMonth = monthChoosen.value.substring(5) - 1;
    //     const monthStartDate = new Date(selectedYear, selectedMonth);

    //     if (!asJSDateRange)
    //     {
    //         // Format the month
    //         const option = {month: "long", year: "numeric"};
    //         // Return that month Date object as a string and formated
    //         return monthStartDate.toLocaleDateString(
    //             "en-US",
    //             option
    //         );
    //     }
    //     else
    //     {
    //         //0th day of the next month is treated as the last day of this month
    //         const monthEndDate = new Date(selectedYear, selectedMonth + 1, 0);
    //         return [monthStartDate, monthEndDate];
    //     }
    // }
}

/**
 * Creates and returns an element with the given type, id, and class.
 * 
 * @param {string} type The type of the element. Must be a valid HTML tag
 * @param {string} id The ID to apply to this element. May be an empty string / null if no ID should be applied
 * @param {string} classes The classes to apply to this element. May be an empty string / null if no classes should be applied
 * @param {string} text The text content to apply to this element. May be omitted if no text content should be applied
 * @returns {HTMLElement} A element that contains whatever the programmer has put as the arguments during the usage
 */
function createElement(type, id, classes, text="")
{
    const newElement = document.createElement(type);

    // If we pass in a id or text, assign it
    if (id) { newElement.id = id }
    if (classes) { newElement.className = classes }
    if (text) { newElement.textContent = text }
    
    return newElement;
}

function removeTable(tableElement)
{
    let tableToRemove = activeScheduleTables.get(tableElement)
    for (const event of tableToRemove.events)
    {
        activeEventsMap.delete(event.id);
        event.remove(); // Remove all calendar events for this table
    }
    activeScheduleTables.delete(tableElement);
    tableElement.parentElement.remove();
}

/**
 * This method creates a reusable delete button element with a trash can icon. It also activates a popup behavior that is already
 * in the html. When the trash can is clicked, the user will be ask to confirm deletion before removing the target element (element as parameter)
 * in the DOM. If you need something else to happen when the button is clicked besides the deletion of the tag, you need to implement it inside of this function,
 * inside of the event listener
 * 
 * @param {HTMLElement} element The element that will be used for deletion when the user approves there desision.
 * @returns {HTMLDivElement} A reusable div with a delete button, trash can icon, and some behavior tied to the button / trash can
 */
function generateDeleteDiv(element)
{
    // Create a container (div) that will hold everything
    const deleteContainer = createElement("div", undefined, "delete-container", undefined);

    // Create a button that will be used for clicking
    const deleteButton = createElement("button", undefined, "delete-button", undefined);

    // Create a event listener for the button for clicked
    deleteButton.addEventListener("click", (event) =>
    {
    
        // Using what triggered the button, we will find the closest tag given as a paramenter
        // Note: The closest method goes up the DOM to find the element
        const closestElement = event.target.closest(element);

        // Get all of the other tags needed
        const yesButton = document.querySelector(".yes-button");
        const noButton = document.querySelector(".no-button");
        const confirmSection = document.querySelector(".confirm-section");
        const confirmText = document.querySelector(".confirm-section").querySelector("p");
        const overlay = document.querySelector(".overlay");
        confirmSection.style.display = "block";
        overlay.style.display = "block";

        if (element === "tr")
        {
            confirmText.textContent = "Are you sure you want to delete this row?"
        }
        if (element === ".section")
        {
            confirmText.textContent = "Are you sure you want to delete this radio station?"
        }


        // Event listener for the yes button
        yesButton.onclick = () =>
        {
            // If the element given is a tr (meaning we will delete a row from a table)
            if (element === "tr")
            {
                // Get the closest table element
                const closestTable = closestElement.closest("table");
                // Plus the associated ScheduleTable
                const closestScheduleTable = activeScheduleTables.get(closestTable);

                // If the last daypart is being removed
                if (closestScheduleTable.height - 1 == 2)
                {
                    // Remove the entire table
                    removeTable(closestTable);
                } else {
                    // Remove the row and decrease table height
                    closestElement.remove();
                    closestScheduleTable.height -= 1;

                    // Re-calculate the totals
                    closestScheduleTable.getAllTotals();
                }
            }
            else if (element === ".section") {
                for (const childTable of closestElement.querySelectorAll('.table-container')) {
                    // Remove all ScheduleTables in this section
                    // table-container -> table
                    const closestTable = childTable.children[1];
                    removeTable(closestTable);
                }
                // Then remove the section from the DOM
                // TODO: recalculate running totals after section removal!
                closestElement.remove();
            }
            else // Else, just remove the element
            {
                closestElement.remove();
            }

            // Hide the confirm and overlay elements
            confirmSection.style.display = "none";
            overlay.style.display = "none";

        }

        // If no was clicked, then just hide it 
        noButton.onclick = () =>
        {
            confirmSection.style.display = "none";
            overlay.style.display = "none"
        }
    })

    // Make a img tag with it's src to the trash can
    const trashCanImage = createElement("img", undefined, "trash-can-image", undefined);
    trashCanImage.src = "images/trash_can.svg";

    // Append the trash can to the button and button to container
    deleteButton.append(trashCanImage);
    deleteContainer.append(deleteButton);

    // Return the div
    return deleteContainer;
    
}

// These variables will be used in the event creation. 
let closestTable;
let closestStationName;
let closestColorPicker;
let closestTableName;
const checkSectionText = document.querySelector(".check-section").querySelector("p");

/**
 * Creates a reusable div that holds a UI image for making draggable calendar events
 * 
 * @returns {HTMLDivElement} Container that creates draggable calendar events
 */
function generateCreateEvent()
{
    
    const checkSectionDiv = document.querySelector(".check-section");
    const overlay = document.querySelector(".overlay");

    // Container for the div that will hold all of the cells
    const container = document.querySelector("#table-draggable-cells"); 

    // Make a div that will hold the button and image
    const eventContainer = createElement("div", undefined, "event-container", undefined);

    // Make button
    const button = createElement("button", undefined, "create-event-button", undefined)
    
    // Make image and give it the src location of the image
    const img = createElement("img", undefined, "calendar-add-image", undefined)
    img.src = "images/calendar_add.svg"

    // Add event listener to calendar image
    button.addEventListener("click", (event) =>
    {
        if (calendar.getIsCreatingSchedule())
        {
            checkSectionDiv.style.display = "block";
            overlay.style.display = "block";
            checkSectionText.innerHTML = "A date range is already being selected!";
            return;
        }

        // Get the closest station name
        closestStationName = event.target.closest(".section").querySelector(".client-name");
        closestTableName = event.target.closest(".table-container").querySelector(".table-name");
        closestTable = event.target.closest(".table-container").querySelector("tbody");

        const rows = closestTable.querySelectorAll("tr > td:first-child");

        // If the rows contain a textarea, add it to array
        for (let i = 0; i < rows.length - 2; i++)
        {
            if (rows[i].querySelector("textarea").value === "")
            {
                checkSectionDiv.style.display = "block";
                overlay.style.display = "block"
                checkSectionText.innerHTML = "Daypart Field(s) cannot be empty!";
                return
            }
        }

        // If empty, notify the user and stop
        if (closestStationName.value === "")
        {
            checkSectionDiv.style.display = "block";
            overlay.style.display = "block"
            checkSectionText.innerHTML = "The Station Name field cannot be empty!";
            return;
        } else if (closestTableName.value === "")
        {
            checkSectionDiv.style.display = "block";
            overlay.style.display = "block"
            checkSectionText.innerHTML = "Table name cannot be empty!"
        }


        // Get these variables and set the calendar to year and activate week numbers
        closestColorPicker = event.target.closest(".table-container").querySelector(".color-picker");
        console.log(closestStationName);
        calendar.setOptionForCalendar("weekNumbers", true)
        calendar.changeViewMode("dayGridYear")
        calendar.setIsCreatingSchedule(true) // Set the calendar variable to true
    })

    // Append all of this to the div
    button.append(img);
    eventContainer.append(button);

    return eventContainer;

}

