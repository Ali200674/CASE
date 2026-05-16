/**
 * This file will be the main entry for this website. It will hold all of the event listeners
 * like making the table, listening for input, etc. This is so we can hide all of the actual logic in a different
 * js file.
 */

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

// When the page loads, we will hide the error and month message, but show the week
// I believe with some time, this could be removed if we take out the table that appears when the website loads up.
window.onload = () =>
{
    // This is to hide the month and error message and show the week section for the generate new schedule
    const weekArea = document.querySelector(".week-selection");
    weekArea.style.display = "flex";

    const monthArea = document.querySelector(".month-selection");
    monthArea.style.display = "none";

    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "none";
  
}

// When we try to add a new client, we make a new section with the clients name choosen
document.getElementById("add-client-button").addEventListener("click", (event) =>
{
    createClientSection();
})

// Variable for the schedule selection
const selectionSchedule = document.querySelector(".type-schedule");

// Listen for changes to the schedule type dropdown
selectionSchedule.addEventListener("change", handleChangeEventForScheduleTypes);

// This will be for the table. It will automatically listen for any inputs when the client types in a number
scheduleTable.addEventListener("input", handleInputEventForSchedules);
scheduleTable.addEventListener("keydown", handleKeyDownEventForSchedules);
scheduleTable.addEventListener("paste", handlePasteEventForSchedules);