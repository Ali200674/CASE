/**
 * This file will be the main entry for this website. It will hold all of the event listeners
 * like making the table, listening for input, etc. This is so we can hide all of the actual logic in a different
 * js file.
 */

// When the page loads, we will hide the error and month message, but show the week
window.onload = () =>
{
    errorMessage.style.display = "none";
    weekArea.style.display = "flex";
    monthArea.style.display = "none";
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


document.getElementById("add-client-button").addEventListener("click", (event) =>
{
    let selected_client = document.getElementById("add-client-dropdown").value;
    document.getElementById("client-name").innerHTML = selected_client;
})

// This is to listen for any changes to the drop down 
selectionSchedule.addEventListener("change", (event) =>
{
    // if the user chooses week
    if (event.target.value === "week")
    {
        // Show the week and hide the month and error message (if still there)
        weekArea.style.display = "flex";
        monthArea.style.display = "none";
        errorMessage.style.display = "none";
    }
    else // Else (month is showing instead)
    {
        // Hide week and error message (if still there) and show month
        weekArea.style.display = "none";
        monthArea.style.display = "block";
        errorMessage.style.display = "none";
    }
})

