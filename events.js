//Contains functions for handling events

// This will be for the table. It will automatically listen for any inputs when the client types in a number
function handleInputEventForSchedules(event)
{
    // If the target is an input field.
    if (event.target.tagName === "INPUT")
    {   
        // Turn the value into a float
        const value = parseFloat(event.target.value)

        // if the value is negative and is not NaN
        if (!isNaN(value) && value < 0)
        {
            event.target.value = 0;
        }
    }

    let parentTable = event.target.parentElement.parentElement.parentElement;
    getAllTotals(parentTable);
}

// Ignore '-' in input fields when typing
function handleKeyDownEventForSchedules(event)
{
    if ( event.key === "-" && event.target.tagName === "INPUT")
    {
        event.preventDefault();
    }
}

// Ignore '-' in input fields when pasting
function handlePasteEventForSchedules(event)
{
    const pastedNum = event.clipboardData.getData("text")

    if (pastedNum.includes("-"))
    {
        event.preventDefault();
    }
}

//Show different input fields based on the chosen schedule type
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

function handleCreateNewSchedule(event)
{
    // Get the button
    const getTarget = event.target;

    // Get the closest tag with ".generate-new-schedule" class
    const getClosestSchedule = getTarget.closest(".generate-new-schedule");

    // Within that tag, find all of these classes
    const weekSelection = getClosestSchedule.querySelector(".week-selection")
    const fromWeek = getClosestSchedule.querySelector(".from-week")
    const toWeek = getClosestSchedule.querySelector(".to-week")
    const errorMessage = getClosestSchedule.querySelector(".error-message")
    const monthChoosen = getClosestSchedule.querySelector(".month-choosen")
    const monthSelection = getClosestSchedule.querySelector(".month-selection")

    // All of these are for the closest tag with the ".generate-new-schedule" class. 
    // If week is showing
    if (weekSelection.style.display === "flex")
    {
        // If either are null
        if (fromWeek.valueAsDate === null || toWeek.valueAsDate === null) 
        { 
            // Show error message and stop button
            errorMessage.style.display = "block";
            return; 
        }
        else // Else, both are not null and don't show message
        {
            errorMessage.style.display = "none"; 
        } 
    }

    // If month is showing
    if (monthSelection.style.display === "block")
    {
        // If month is null
        if (monthChoosen.valueAsDate === null) 
        {
            // Show error and stop
            errorMessage.style.display = "block";
            return; 
        }
        else // Else, not null and don't show message
        {
            errorMessage.style.display = "none";
        }
    }


    // Call this function to insert the table, pass in the closest schedule
    insertTableToDOM(getClosestSchedule);
}