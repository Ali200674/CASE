// All of this code is for the schedule
// Variables
const scheduleTable = document.querySelector(".table-container");
const allTotalIDs = ["adsTotal", "mondayTotal", "tuesdayTotal",
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


/*
    This is for the columns. It will add up all of the cells in the column and return the total
*/
function calculateTotalColumn(singleColumn)
{
    // Get all of the cells in a column
    const column = document.querySelectorAll("." + singleColumn);

    let total = 0;

    // For each cell
    for (const x of column)
    {
        // Get the value (or text content for the last row)
        let currentValue = x.value || x.textContent

        // If it contains the "$", replace and trim it.
        currentValue = currentValue.replace("$", "").trim();

        // Parse it.
        const value = parseFloat(currentValue)

        // If it's not NaN, add it
        if (!isNaN(value))
        {
            total += value;
        }
    }

    // Return it
    return total;
}

// This is to calculate each row. It will add up all of the cells in a row and return the total of it.
function calculateTotalRow(singleRow)
{
    let total = 0;

    const row = document.querySelectorAll("." + singleRow);

    // Loop through the cells in each row
    for (let i = 0; i < row.length; i++)
    {
        
        // Get the value
        const value = parseFloat(row[i].value)

        // If the row is not empty
        if (!isNaN(value))
        {
            // If it's the rate column, multiply instead of adding.
            if (i == row.length - 1)
            {
                total *= value;
            }
            else
            {
                total += value;
            }
        }
    }

    // Return the total.
    return total;
}

/*
    This method will display the total of a row / column.
*/
function displayTotal(totalCell, amount, moneySign = false)
{
    // We will get the total cell (either a row or column)
    const totalCellId = document.querySelector("#" + totalCell);

    // If there will be a money sign, then concatinate it to the amount
    if (moneySign)
    {
        totalCellId.textContent = "$" + amount;
    } else // else, just put the amount only
    {
        totalCellId.textContent = amount;
    }  
} 

/*
    This method will be used to generate all of the totals in the "Weekly Totals"
    cells. It include the cells of each row and each column.
 */
function getAllTotals()
{
    // This loop is for the rows.
    for (let i = 0; i < allRowClasses.length; i++)
    {
        // This is for calculating the total row to row.
        const rowAmount = calculateTotalRow(allRowClasses[i])
        displayTotal(allRowColumnTotalID[i], rowAmount.toFixed(2))
    }
     

    // This loop is for the columns
    for (let i = 0; i < allTotalIDs.length; i++)
    {
        // This is for calculating the totals column to column
        const amount = calculateTotalColumn(allColumnClasses[i])

        // If it's the last two rows (rate and total), add a "$" to the number
        // else, don't
        if (i > allTotalIDs.length - 3)
        {
            displayTotal(allTotalIDs[i], amount.toFixed(2), true)
        }
        else
        {
            displayTotal(allTotalIDs[i], amount)
        }   
    }
}

// THIS IS FOR THE DYNAMIC TABLE 
// VARIABLES
// This is the button to create the table.
const button = document.querySelector(".make-schedule");

// An event lister that listens for the button to be clicked.
button.addEventListener("click", (event) =>
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
})


/**
 * This method inserts the table into the DOM.
 * Specifically, it gets inserted above the closest div that has the element's class
 * 
 * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 */
function insertTableToDOM(element)
{
    
    // Build the table for that schedule
    const ele = buildTable(element);

    // Insert the table ABOVE the element (or before this element comes up)
    element.parentNode.insertBefore(ele, element);
}

/**
 * This method creates a table and returns it.
 * 
 * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 * returns: A table
 */
function buildTable(element)
{
    // Create a container (div)
    const container = createElement("div", null, "table-container")

    // Create a div for the type of schedule h3 heading
    const h3Wrapper = createElement("div", null, "schedule-type-wrapper");

    // Create a h3 heading with Type of Schedule text
    const headingThree = createElement("h3", null, "schedule-type", getTypeOfSchedule(element));

    // Append the h3 to the h3Wrapper div
    h3Wrapper.append(headingThree)

    // Append all of that to the main div
    // container.append(clientName, scheduleContainer);

    // Append the h3 and the table to the div 
    container.append(h3Wrapper, createWholeTable());

    // Return the table
    return container;
}

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
    const weekArea = element.querySelector(".week-selection")
    const fromWeek = element.querySelector(".from-week")
    const toWeek = element.querySelector(".to-week")
    const monthArea = element.querySelector(".month-selection")
    const monthChoosen = element.querySelector(".month-choosen")

    // If the week is showing
    if (weekArea.style.display === "flex")
    {
            // Make a option object that formats the value received 
            const option = {month: "long", day: "2-digit", year: "numeric",}

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
        const option = {month: "long", year: "numeric",}
        
        // Make a Date object based on the value. split the value given into two strings (year and month) 
        // Due to the indexing of the months (0 - 11 instead of 1 - 12), decrement the month by 1
        const monthDateObject = new Date(monthChoosen.value.substring(0, 4), monthChoosen.value.substring(5) - 1);
        
        // Return that month Date object as a string and formated
        return monthDateObject.toLocaleDateString(
            "en-US",
            option
        );
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

/**
 * This method creates the whole table (schedule) and then returns it.
 * 
 * returns: the schedule.
 */
function createWholeTable()
{
    // Make element table
    const table = document.createElement("table")

    // Create tbody
    const tableBody = document.createElement("tbody");

    // Append tableBody to table
    table.append(tableBody);

    // Create the tr elements for the table
    const trEles = createTrElements();
    
    // Populate the first tr with the columns
    populateFirstTr(trEles[0])

    // Populate the other tr elements
    populateOtherTrElements(trEles)

    // For every tr element made, append it to the table
    for (let i = 0; i < trEles.length; i++)
    {
        tableBody.append(trEles[i]);
    }

    // Return that table
    return table;
}

/**
 * This method creates a array of tr elements and returns it.
 * 
 * returns: A array of tr elements.
 * 
 */
function createTrElements()
{
    // A array of soon to be tr elements
    const trs = [];

    // A for loop to add to the array
    for (let i = 0; i < Math.max(7); i++)
    {
        trs.push(document.createElement("tr"));
    }

    // Return that array of tr elements
    return trs;
}

/**
 * This method populates the first tr element of every table made.
 * It populates it with a array of column headings.
 * 
 * returns: the tr element that had a bunch of th elements with every heading in the array.
 * 
 */

function populateFirstTr(firstTrEle)
{
    // Create the array of column headings.
    const headings = ["DAYPART", "ads/wk", "Length", "MO", "TU", "WE", "TH", "FR", "SA", "SU", "RATE", "COST"]

    // Loop through the array
    for (let i = 0; i < headings.length; i++)
    {
        // Create th elemenent
        const thEle = document.createElement("th");

        // Assign the text content to a column heading
        thEle.textContent = headings[i];

        // Append it to the tr element
        firstTrEle.append(thEle);
    }
}

function populateOtherTrElements(trArray)
{
    const elementTitles = ["Morning (7a-10a)", "Middays (10a-3p)", "Afternoons(3p-6:30p)", "Sa-Su 9a-2p", "M-Su 12M-12M Bonus", "Weekly Totals:"]
    // const allTotalIDs = ["adsTotal", "mondayTotal", "tuesdayTotal",
    //     "wednesdayTotal", "thursdayTotal", "fridayTotal", "saturdayTotal",
    //     "sundayTotal", "rateTotal", "costTotal"
    // ]
    // const allColumnClasses = [
    //     "ads", "monday", "tuesday",
    //     "wednesday", "thursday", "friday", "saturday",
    //     "sunday", "rate", "cost"
    // ]
    // const allRowClasses = ["rowOne", "rowTwo", "rowThree", "rowFour", "rowFive"];
    // const allRowColumnTotalID = ["rowOneTotal", "rowTwoTotal", "rowTotalThree", "rowTotalFour", "rowTotalFive"];



    // For every tr element in the table
    for (let row = 1; row < trArray.length; row++)
    {

        // We will add 12 td elements to that tr element
        for (let col = 0; col < 11; col++)
        {
            // Make a td element
            const tdEle = document.createElement("td");

            let isDayPart = (col == 0);
            let isAdLengthField = (col == 2);
            let isWeeklyTotalsRow = (row != trArray.length - 1)

            // If it's 0, that td will be a day part.
            if (isDayPart)
            {
                tdEle.textContent = elementTitles[row - 1];

                // Add class for css
                tdEle.classList.add("time-slot");
            }

            // Don't modify the "Weekly totals" row
            if (row != trArray.length - 1)
            {
                // If j is the second one (it's the length of a ad)
                if (isAdLengthField)
                {
                    // We add a drop down for the length of a ad
                    tdEle.append(createSections());
                }
                // Else it's a basic td element with a input field
                else if (!isDayPart)
                {
                    // Make a input field, give a type of number and min of 0
                    const inputEle = document.createElement("input");
                    inputEle.type = "number"
                    inputEle.min = "0";

                    // Append it to the td element
                    tdEle.append(inputEle);
                }   
              }  
            
            // Append that td element to the tr element.
            trArray[row].append(tdEle)
        }
    }
}

/**
 * 
 * This method creates a drop down of the length of an ad.
 * 
 * 
 * A drop down with four options for a length of an ad 
 */
function createSections()
{
    // Create select tag
    const selection = document.createElement("select")

    // Make array of values
    const values = [":60", ":30", ":15", ":10"]

    // For each value to be added to the select tag
    for (let i = 0; i < values.length; i++)
    {
        // Create opition tag
        const option = document.createElement("option");
        
        // Set text content to the values[i]
        option.textContent = values[i];

        // Append that opinion tag to the select tag
        selection.append(option);
    }

    // Return that select tag
    return selection;
}



