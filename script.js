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

/**
 * This method gets the type of schedule from whatever the user is using to add in a schedule (week or month)
 * It gets the value from whatever the user has choosen, formats it to a usable date, then returned as a string.
 * 
 * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 * return: Returns a date based on if the user chooses the week selection or the month selection
 */
function getTypeOfSchedule(element)
{
    // Find all of the elements in that element passed
    const weekArea = element.querySelector(".week-selection");
    const fromWeek = element.querySelector(".from-week");
    const toWeek = element.querySelector(".to-week");
    const monthArea = element.querySelector(".month-selection");
    const monthChoosen = element.querySelector(".month-choosen");

    // If the week is showing
    if (weekArea.style.display === "flex")
    {
            // Make a option object that formats the value received 
            const option = {month: "long", day: "2-digit", year: "numeric",};

            /*
                What this does is that it converts the values returned to a Date object,
                then with that Date object, we turn it into a string with the toLocaleDateString.
                for it's parameters, we give it a format of the date (US in this case), then 
                we pass in the option object to format the date to whatever we want it to be. 
            */
            return fromWeek.valueAsDate.toLocaleDateString("en-US", option) + " - " + toWeek.valueAsDate.toLocaleDateString("en-US", option);
        
    }
    else // Else, the month is showing instead
    {
        // Format the month
        const option = {month: "long", year: "numeric"};
        
        // Make a Date object based on the value 
        const monthDateObject = new Date(monthChoosen.value);
        
        // Due to the indexing of the months (0 - 11 instead of 1 - 12), increment the month by one
        monthDateObject.setMonth(monthDateObject.getMonth() + 1);
        
        // Return that month Date object as a string and formated
        return monthDateObject.toLocaleDateString("en-US", option);
    }
}

/**
 * Creates and returns an element with the given type, id, and class.
 * 
 * type: The type of the element. Must be a valid HTML tag
 * id: The ID to apply to this element. May be an empty string / null if no ID should be applied
 * classes: The classes to apply to this element. May be an empty string / null if no classes should be applied
 * text: The text content to apply to this element. May be omitted if no text content should be applied
 * 
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



