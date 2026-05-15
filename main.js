/**
 * This file will be the main entry for this website. It will hold all of the event listeners
 * like making the table, listening for input, etc. This is so we can hide all of the actual logic in a different
 * js file.
 */

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


// This will be for the table. It will automatically listen for any inputs when the client types in a number
scheduleTable.addEventListener("input", (event) =>
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

    getAllTotals();
})

// This is a event listener that listens to the keyboard. If they press in a "-" and if it's coming
// from the input tag, don't let it happen
scheduleTable.addEventListener("keydown", (event) =>
{
    if ( event.key === "-" && event.target.tagName === "INPUT")
    {
        event.preventDefault();
    }
})

// This listens for anything that the user pastes into the table. If it contains
// a "-", it will stop it.
scheduleTable.addEventListener("paste", (event) =>
{
    const pastedNum = event.clipboardData.getData("text")

    if (pastedNum.includes("-"))
    {
        event.preventDefault();
    }
})

// When we try to add a new client, we make a new section with the clients name choosen
document.getElementById("add-client-button").addEventListener("click", (event) =>
{
    createClientSection();
})

// Variable for the schedule selection
const selectionSchedule = document.querySelector(".type-schedule");

// This is to listen for any changes to the drop down () 
// NOTE: This is only for the table when the page is loaded.
// If we remove the table that appears when the page is loaded in
// favor of only the dynamic creation (if we have the time), we could be removed and same as the code in the windows.load() (I believe so)
selectionSchedule.addEventListener("change", (event) => 
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
})



