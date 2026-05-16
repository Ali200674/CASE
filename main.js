/**
 * This file will be the main entry for this website. It will hold all of the event listeners
 * like making the table, listening for input, etc. This is so we can hide all of the actual logic in a different
 * js file.
 */

// When the page loads, we will hide the error and month message, but show the week
// I believe with some time, this could be removed if we take out the table that appears when the website loads up.
window.onload = () =>
{
    // Show the week picker by default
    const weekArea = document.querySelector(".week-selection");
    weekArea.style.display = "flex";

    const monthArea = document.querySelector(".month-selection");
    monthArea.style.display = "none";

    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "none";

    const generateScheduleButton = document.querySelector(".make-schedule");
    generateScheduleButton.addEventListener("click", generateNewSchedule);

    const addClientButton = document.getElementById("add-client-button");
    addClientButton.addEventListener("click", createClientSection);
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