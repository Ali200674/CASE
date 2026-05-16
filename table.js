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

    const costCell = cells[cells.length -1];
    const costTotal = totals[totals.length - 1];
    displayTotal(costCell, costTotal, true);
}

/*
Calculates all necessary totals for a row, returns an array containing each column value including the final total.
Runs updateTotalsForRow to update the ads/week and cost fields with the new totals.

Example return value:
ads/week, length, mon, tues, wed, thur, fri, sat, sun, rate, cost
[19, 1.0, 1, 5, 2, 1, 1, 5, 4, 5, 95]
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
        let value = parseFloat(cell.value);

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
    let cost = adsPerWeekTotal * totals.at(-1);

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
    // Columns that don't need a total displayed (e.g length, rate) are null
    let columnTotals = [0, null, 0, 0, 0, 0, 0, 0, 0, null, 0];

    // Loop through each row in the table, skipping headers and final totals
    for (let rowIndex = 1; rowIndex < rows.length - 1; rowIndex++)
    {

        // Grab the tr element to calculate totals for
        const row = rows[rowIndex];
        // Calculate the totals for this row
        const rowTotals = calculateAndUpdateTotalsForRow(row);

        // Add totals for each column to column totals
        for (let totalIndex = 0; totalIndex < rowTotals.length; totalIndex++) {
            let rowTotal = rowTotals[totalIndex];
            
            // Skip null column totals (we don't need to calculate a total for this column)
            if (columnTotals[totalIndex] == null)
            {
                continue;
            }

            columnTotals[totalIndex] += rowTotal;
        }
    }

    for (let columnIndex = 0; columnIndex <= columnTotals.length; columnIndex++)
    {
        let finalColumnTotal = columnTotals[columnIndex];
        
        // Once again skip null column totals
        if (finalColumnTotal == null) {
            continue;
        }

        let finalTotalCellIndex = columnIndex + 1; // We don't want to overwrite the "Weekly totals" header
        // The weekly totals row is the last in the table. The cells containing the totals are its children
        let finalTotalCellToUpdate = rows[rows.length - 1].children[finalTotalCellIndex];

        if (finalTotalCellIndex == columnTotals.length) { // Display a dollar sign in the cost total
            displayTotal(finalTotalCellToUpdate, finalColumnTotal, true);
        } else {
            displayTotal(finalTotalCellToUpdate, finalColumnTotal, false);
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
function createAdLengthDropdown()
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

/**
 * This method inserts the table into the DOM.
 * Specifically, it gets inserted above the closest div that has the element's class
 * 
 * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 */
function insertTableToDOM(element)
{
    
    // Build the table for that schedule
    const newTable = buildTable(element);

    //Add event listeners to the table
    newTable.addEventListener("input", handleInputEventForSchedules);
    newTable.addEventListener("paste", handlePasteEventForSchedules);
    newTable.addEventListener("keydown", handleKeyDownEventForSchedules);

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
    
    // For every tr element in the table
    for (let row = 1; row < trArray.length; row++)
    {

        // We will add 12 td elements to that tr element
        for (let col = 0; col < 12; col++)
        {
            // Make a td element
            const tdEle = document.createElement("td");

            let isDayPart = (col == 0);
            let isAdsPerWeekField = (col == 1);
            let isAdLengthField = (col == 2);
            let isCostField = (col == 11);
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
                    tdEle.append(createAdLengthDropdown());
                }
                // Create a blank span for ads/week
                else if (isAdsPerWeekField)
                {
                    tdEle.append(createElement("span", null, "ads", "0"));
                }
                // If it's not a special element or already filled in it's a regular input field
                else if (!isDayPart && !isCostField)
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