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

    let parentTable = event.target.parentElement.parentElement.parentElement;
    console.log(parentTable);
    getAllTotals(parentTable);
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

/*
    This method will display the total of a row / column.
*/
function displayTotal(target, total, moneySign = false)
{
    // If there will be a money sign, then concatenate it to the amount
    if (moneySign)
    {
        target.textContent = "$" + total;
    } else // else, just put the amount only
    {
        target.textContent = total;
    }  
} 

/*
Updates the ads/week and cost fields for the row provided.
*/
function updateTotalsForRow(singleRow, totals)
{
    const cells = singleRow.children;

    const adsPerWeekCell = cells[1];
    const adsPerWeekTotal = totals[0];
    displayTotal(adsPerWeekCell, adsPerWeekTotal, false);

    const costCell = cells[-1];
    const costTotal = totals[-1];
    displayTotal(costCell, costTotal, true);
}

/*
Calculates all necessary totals for a row, returns an array containing each column value including the final total.
Runs updateTotalsForRow to update the ads/week and cost fields with the new totals.

Example return value:
ads/week, length, mon, tues, wed, thur, fri, sat, sun, rate, cost
[4, 1.0, 3, 3, 3, 2, 1, 4, 4]
*/
function calculateAndUpdateTotalsForRow(singleRow)
{
    let totals = [];

    const cells = singleRow.children;

    // Loop through the cells in the row, skipping dayparts, ads/week, and cost
    for (let i = 2; i < cells.length - 1; i++)
    {
        //Get the input field contained within the table element
        let cell = cells[i].children[0];

        // Get the value of the element
        const value = parseFloat(cell.value);

        if (cell.className.includes("adLength")) { // Cell is the ad length selector? Append the selected value to the totals
            totals.push(value);
            continue;
        }

        //If the cell is empty use 0 as a placeholder
        if (isNaN(value))
        {
            value = 0;
        }
        totals.push(value);
    }

    // Create an array of just the ad counts
    // by slicing off the first and last elements (length and rate)
    let adCountsArray = totals.slice(1, -1);

    // Get the total amount of ads for the week
    let adsPerWeekTotal = adCountsArray.reduce((total, value) => total + value, 0);
    // Calculate cost by multiplying this by the rate
    let cost = adsPerWeekTotal * totals[-1];

    //Add these values to the array of totals
    totals.unshift(adsPerWeekTotal);
    totals.push(cost);

    updateTotalsForRow(singleRow, totals);

    // Return the totals.
    return totals;
}

/*
    This method will be used to generate all of the totals in the "Weekly Totals"
    cells. It include the cells of each row and each column.
 */
function getAllTotals(parentTable)
{

    let rows = parentTable.children;
    // Columns that don't need a total displayed (e.g rate) are null
    let columnTotals = [0, 0, 0, 0, 0, 0, 0, null, 0];

    //Loop through each row in the table, skipping headers
    for (let i = 1; i < rows.length; i++)
    {
        //Calculate the totals for this row
        const rowTotals = calculateAndUpdateTotalsForRow(row);
    }
}

// THIS IS FOR THE DYNAMIC TABLE 
// VARIABLES
// This is the button to create the table.
const button = document.querySelector("#make-schedule");

// This is the div that stores the button. every time the button get's pressed, the table gets inserted above this div
const mainDiv = document.querySelector("#generate-new-schedule");

// An event lister that listens for the button to be clicked.
button.addEventListener("click", () =>
{
    // Call this function to insert the table
    insertTableToDOM();
})


/**
 * This method inserts the table into the DOM.
 * Specifically, it gets inserted above the div that holds the button.
 */
function insertTableToDOM()
{
    // Build the table
    const ele = buildTable();

    // Insert the table ABOVE the div (or before this div comes up)
    mainDiv.parentNode.insertBefore(ele, mainDiv);
}

/**
 * This method creates a table and returns it.
 * 
 * returns: A table
 * 
 */
function buildTable()
{
    // Create a container (div)
    const container = createElement("div", null, "table-container")

    // Create a div for the type of schedule h3 heading
    const h3Wrapper = createElement("div", null, "schedule-type-wrapper");

    // Create a h3 heading with Type of Schedule text
    const headingThree = createElement("h3", null, "schedule-type", "Weekly Schedule");

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