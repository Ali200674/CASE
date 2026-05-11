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


/*
Calculates all necessary totals for a row, returns an array containing each column value including the final total.

Example return value:
ads/week, length, mon, tues, wed, thur, fri, sat, sun, rate, cost
[4, 1.0, 3, 3, 3, 2, 1, 4, 4]
*/
function calculateTotalsForRow(singleRow)
{
    let total = 0;

    const cells = singleRow.children;

    // Loop through the cells in each row, skipping dayparts
    for (let i = 1; i < cells.length; i++)
    {
        
        //Get the input field contained within the table element
        let cell = cells[i].children[0];

        let adsPerWeekElement = null;
        // If this is the ads/week column, hold onto that element so it can be updated later
        if (i == 1)
        {
            adsPerWeekElement = cell;
            
        }

        // Get the value of the element
        const value = parseFloat(cells[i].children[0].value)

        // If the row is not empty
        if (!isNaN(value))
        {
            // If it's the rate column, multiply instead of adding.
            if (i == cells.length - 1)
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
    This method will be used to generate all of the totals in the "Weekly Totals"
    cells. It include the cells of each row and each column.
 */
function getAllTotals(parentTable)
{

    let rows = parentTable.children;
    let columnTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    //Loop through each row in the table, skipping headers
    for (let i = 1; i < rows.length; i++)
    {
        //Calculate the total for this row
        const rowTotal = calculateTotalForRow(row)
    }
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