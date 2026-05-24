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

    // Move the costcell back two (because of deletion div and calendar cell)
    const costCell = cells[cells.length - 3];
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
    // Update, will skip the deletion column and calendar column as well
    for (let i = 2; i < cells.length - 3; i++)
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

        // If this is the fake "+ Add Daypart" row,
        // skip it because it is not a real schedule row
        const daypartInput = row.children[0].querySelector("input");

        if (daypartInput && daypartInput.value === "+ Add Daypart")
        {
            continue;
        }

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
    for (let i = 0; i < Math.max(8); i++)
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

// Added element as a parameter so we can grab whatever
// week the user selected and use that information
// to build the table headings dynamically
function populateFirstTr(firstTrEle, element)
{
    // Create the array of column headings.
    const headings = [
    "DAYPART", 
    "ads/wk", 
    "Length", 
    "MON", 
    "TUE", 
    "WED", 
    "THU", 
    "FRI", 
    "SAT", 
    "SUN", 
    "RATE", 
    "COST"
    ];

    const weekOf = element.querySelector(".week-of");


    // The week picker returns something like:
    // "2026-W22"
    // Split that into:
    // ["2026", "22"]
    const splitWeek = weekOf.value.split("-W");

    // Grab the year and week number separately
    const year = parseInt(splitWeek[0]);
    const weekNumber = parseInt(splitWeek[1]);

    // Start at Jan 1st, then move forward
    // by however many weeks were selected
    const monday = new Date(year, 0, 1 + (weekNumber - 1) * 7);

    // moving backwards until we land on Monday
    while (monday.getDay() !== 1)
    {
        monday.setDate(monday.getDate() - 1);
    }

    // Make an array that will hold all 7 dates
    // for the selected broadcast week
    const dates = [];

    // Loop 7 times (Monday -> Sunday)
    for (let i = 0; i < 7; i++)
    {
        //make a new copy of monday
        const currentDate = new Date(monday);

        //move forward however many days we are into the week
        currentDate.setDate(monday.getDate() + i);

        // Push formatted dates into the array
        // Example:
        // "5/25"
        dates.push(
            currentDate.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric"
            })
        );
    }

    // Loop through the array
    for (let i = 0; i < headings.length; i++)
    {
        // Create th elemenent
        const thEle = document.createElement("th");

        // Use innerHTML instead of textContent
        // so we can add line breaks inside the table headings
        thEle.innerHTML = headings[i];

        // If this is one of the weekday columns,
        // put the date above the weekday label
        // Example:
        // 5/25
        // MO
        if (i >= 3 && i <= 9)
        {
            thEle.innerHTML = dates[i - 3] + "<br>" + headings[i];
        }

        // Append it to the tr element
        firstTrEle.append(thEle);
    }
}

function populateOtherTrElements(trArray)
{
    const elementTitles = [
        "Morning (7a-10a)",
        "Middays (10a-3p)", 
        "Afternoons(3p-6:30p)", 
        "Sa-Su 9a-2p", 
        "M-Su 12M-12M Bonus",
        "+ Add Daypart", 
        "Weekly Totals:"
    ]
    
    // For every tr element in the table
    for (let row = 1; row < trArray.length; row++)
    {

        // We will add 13 td elements to that tr element
        // Update: to 14 elements to add in new div for deletion of rows and create events of those rows
        for (let col = 0; col < 14; col++)
        {
            // Make a td element
            const tdEle = document.createElement("td");

            let isDayPart = (col == 0);
            let isAdsPerWeekField = (col == 1);
            let isAdLengthField = (col == 2);
            let isCostField = (col == 11);
            let isSpecialRow = (
                row === trArray.length - 1 ||
                row === trArray.length - 2
            );

            // If it's 0, that td will be a day part.
            if (isDayPart)
            {
                // If this is the weekly totals row,
                // don't make an editable input field.
                // Just put plain text instead.
                if (elementTitles[row - 1] === "Weekly Totals:")
                {
                    tdEle.textContent = "Weekly Totals:";
                }
                else
                {
                    // Otherwise make a normal editable daypart input field
                    const dayPartInputField = createElement("input", null, "daypart-input");
                    dayPartInputField.type = "text";
                    dayPartInputField.value = elementTitles[row - 1];

                    // If this is the fake "+ Add Daypart" row,
                    // make it readonly and style it like a button
                    if (elementTitles[row - 1] === "+ Add Daypart")
                    {
                        dayPartInputField.readOnly = true;
                        dayPartInputField.classList.add("add-daypart-button");

                        // When this fake button row is clicked,
                        // run the add row function
                        dayPartInputField.addEventListener("click", handleAddDaypartRow);
                    }

                    // Add the input field into the td
                    tdEle.append(dayPartInputField)
                }

                // Add css styling class for the daypart column
                tdEle.classList.add("time-slot");
            }

            // If the row is the last row and it's the last two column, don't do anything
            if (row == trArray.length - 1 && (col == 12 || col == 13) ) { continue; }

            // Don't modify the "Weekly totals" row
            if (!isSpecialRow)
            {
                // If it's the second to last cell in the td, add in the delete div
                if (col == 12)
                {
                    // Append the div with the td element (because that will be removed when clicked)
                    tdEle.append(generateDeleteDiv("tr"));
                }
                // If is the last cell in the td, add a create event div
                else if (col == 13)
                {
                    tdEle.append(generateCreateEvent())
                }
                // If j is the second one (it's the length of a ad)
                else if (isAdLengthField)
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

/**
 * This method creates the whole table (schedule) and then returns it.
 * 
 * returns: the schedule.
 */

// Added element as a parameter so we can pass the selected
// schedule information down into the table builder
function createWholeTable(element)
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
    populateFirstTr(trEles[0], element)
    
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
 * This method creates a table and returns it.
 * 
 * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
 * returns: A table
 */

// Pass the element into createWholeTable so the table
// can access the selected week/month information
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
    container.append(h3Wrapper, createWholeTable(element));

    // Return the table
    return container;
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
    element.parentNode.insertBefore(newTable, element);
}