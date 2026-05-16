// All of this code is for the schedule
// Variables
const scheduleTable = document.querySelector(".table-container");
const allTotalClasses = ["adsTotal", "mondayTotal", "tuesdayTotal",
    "wednesdayTotal", "thursdayTotal", "fridayTotal", "saturdayTotal",
    "sundayTotal", "rateTotal", "costTotal"
]
const allColumnClasses = [
    "ads", "monday", "tuesday",
    "wednesday", "thursday", "friday", "saturday",
    "sunday", "rate", "cost"
]
const allRowClasses = ["rowOne", "rowTwo", "rowThree", "rowFour", "rowFive"];
const allRowColumnTotalID = ["rowOneTotal", "rowTwoTotal", "rowTotalThree", "rowTotalFour", "rowTotalFive"];

document.getElementById("add-client-button").addEventListener("click", (event) =>
{
    let selected_client = document.getElementById("add-client-dropdown").value;
    document.getElementById("client-name").innerHTML = selected_client;
})



