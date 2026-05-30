/**
 * @file A class for a table
 * 
 * @author Colin Rice
 * @version 1.0.0
 * @module table.js
 */


activeScheduleTables = {}

/**
 * Info
 * 
 */
class ScheduleTable {

    fromDate = null;
    toDate = null;

    colHeadings = ["DAYPART", "ads/wk", "Length", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "RATE", "COST"];
    defaultDayParts = ["Morning (7a-10a)", "Middays (10a-3p)", "Afternoons(3p-6:30p)", "Sa-Su 9a-2p", "M-Su 12M-12M Bonus"];
    rowHeadings = ["+ Add Daypart", "Totals:"];

    // Skip dayparts and ads/week
    columnsToSkipAtStart = 2;
    // Skip cost / other utility columns
    columnsToSkipAtEnd = 3;
    // Skip headers
    rowsToSkipAtStart = 1;
    // Skip weekly totals and 'add daypart'
    rowsToSkipAtEnd = 2;

    width = 0;
    height = 0;
    tableElement = null;

    rowTotals = [];
    columnTotals = [0, null, 0, 0, 0, 0, 0, 0, 0, null, 0];

    // 
    // 
    // 
    /**
     * Initialize a table with the provided date range
     * These dates should be obtained through getScheduleDate
     * prefillWithDefaultDayParts should always be true, toggle has not been implemented
     * 
     * @param {*} fromDate 
     * @param {*} toDate 
     * @param {*} prefillWithDefaultDayParts 
     */
    constructor(fromDate, toDate, prefillWithDefaultDayParts = true) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        if (prefillWithDefaultDayParts) {
            this.rowHeadings = this.defaultDayParts.concat(this.rowHeadings);
        }
        this.width = this.colHeadings.length + this.columnsToSkipAtEnd - 1; // All columns + utilities (delete and calendar buttons)
        this.height = this.rowHeadings.length;
        // Initialize an empty array for each row's totals
        for (let i = 0; i < this.height; i++) {
            this.rowTotals.push([]);
        }
    }



   /**
    * This method will display the total of a row / column.
    * 
    * @param {*} target 
    * @param {*} total 
    * @param {*} moneySign 
    */
    displayTotal(target, total, moneySign = false)
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

   /**
    * Updates the ads/week and cost fields for the row provided.
    * 
    * @param {HTMLTableRowElement} singleRow 
    * @param {number} rowIndex 
    */
    updateTotalsForRow(singleRow, rowIndex)
    {
        const cells = singleRow.children;
        const totals = this.rowTotals[rowIndex];

        const adsPerWeekCell = cells[1];
        const adsPerWeekTotal = totals[0];
        this.displayTotal(adsPerWeekCell, adsPerWeekTotal, false);

        // Move the costcell back (because of utility divs)
        const costCell = cells[cells.length - this.columnsToSkipAtEnd];
        const costTotal = totals[totals.length - 1];
        this.displayTotal(costCell, costTotal, true);
    }

    /*
    
    */
   /**
    * Calculates all necessary totals for a row, updates this.rowTotals with an array containing each column value including the final total.
    * Runs updateTotalsForRow to update the ads/week and cost fields with the new totals.
    *
    * Example addition to this.rowTotals:
    * ads/week, length, mon, tues, wed, thur, fri, sat, sun, rate, cost
    * [19, 1.0, 1, 5, 2, 1, 1, 5, 4, 5, 95]
    * 
    * @param {HTMLTableRowElement} singleRow A row (td element) from a table
    * @param {number} rowIndex Index
    */
    calculateAndUpdateTotalsForRow(singleRow, rowIndex)
    {
        const cells = singleRow.children;
        let totals = this.rowTotals[rowIndex];

        // Loop through the cells in the row, skipping special cells
        for (let i = this.columnsToSkipAtStart; i < cells.length - this.columnsToSkipAtEnd; i++)
        {
            //Get the input field contained within the table element
            let cell = cells[i].children[0];
            // Get the value of the element
            let value = parseFloat(cell.value);
            //If the cell is empty use 0 as a placeholder
            if (isNaN(value))
            {
                value = 0;
            }
            totals.push(value); // Add the value to the running total
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
        this.rowTotals[rowIndex] = totals;
        this.updateTotalsForRow(singleRow, rowIndex);
    }

    /**
     * This method displays the totals for each column
     * 
     */
    displayColumnTotals()
    {
        let tbody = this.tableElement.children[0];
        let rows = tbody.children;
        for (let columnIndex = 0; columnIndex <= this.columnTotals.length; columnIndex++)
        {
            let finalColumnTotal = this.columnTotals[columnIndex];

            // Skip null column totals
            if (finalColumnTotal == null) {
                continue;
            }

            let finalTotalCellIndex = columnIndex + 1; // We don't want to overwrite the "Weekly totals" header
            // The weekly totals row is the last in the table. The cells containing the totals are its children
            let finalTotalCellToUpdate = rows[rows.length - 1].children[finalTotalCellIndex];

            if (finalTotalCellIndex == this.columnTotals.length) { // Display a dollar sign in the cost total
                this.displayTotal(finalTotalCellToUpdate, finalColumnTotal, true);
            } else {
                this.displayTotal(finalTotalCellToUpdate, finalColumnTotal, false);
            }
        }
    }

    /**
     * Gets all of the totals in the table
     * 
     */
    getAllTotals()
    {
        //Rows are wrapped in a tbody element
        let tbody = this.tableElement.children[0];
        let rows = tbody.children;
        //Clear rowTotals and columnTotals
        this.rowTotals = [];
        this.columnTotals = [0, null, 0, 0, 0, 0, 0, 0, 0, null, 0];
        for (let i = 0; i < this.height; i++) {
            this.rowTotals.push([]);
        }
        // Loop through each row in the table, skipping headers and final totals
        for (let rowIndex = this.rowsToSkipAtStart; rowIndex < rows.length - this.rowsToSkipAtEnd; rowIndex++)
        {
            // Calculate the totals for this row
            this.calculateAndUpdateTotalsForRow(rows[rowIndex], rowIndex);
            // Add totals for each column to column totals
            for (let totalIndex = 0; totalIndex < this.rowTotals[rowIndex].length; totalIndex++) {
                let rowTotal = this.rowTotals[rowIndex][totalIndex];
                // Skip null column totals (we don't need to calculate a total for this column)
                if (this.columnTotals[totalIndex] == null)
                {
                    continue;
                }
                this.columnTotals[totalIndex] += rowTotal;
            }
        }
        this.displayColumnTotals();
    }

    // Creates an ad length dropdown for use in a new table.
    createAdLengthDropdown()
    {
        const selection = document.createElement("select");
        const values = [":60", ":30", ":15", ":10"];

        for (let i = 0; i < values.length; i++)
        {
            const option = document.createElement("option");
            option.textContent = values[i];
            selection.append(option);
        }
        return selection;
    }

    // Creates and returns an array of rows for a new table
    createTrElements()
    {
        const trs = [];

        // Add an extra row for headings
        for (let i = 0; i < this.rowHeadings.length+1; i++)
        {
            trs.push(document.createElement("tr"));
        }

        // Return that array of tr elements
        return trs;
    }

    /**
     * Populates the first table row with column headings
     * 
     * @param {HTMLTableRowElement} firstTrEle 
     * @param {HTMLDivElement} generateScheduleElement 
     */
    populateFirstTr(firstTrEle, generateScheduleElement)
    {
        const weekOf = generateScheduleElement.querySelector(".week-of");
        let dates = [];
        if (weekOf)
        {
            let startDate = getScheduleDate(generateScheduleElement, true)[0];

            // Loop 7 times (Monday -> Sunday)
            for (let i = 0; i < 7; i++)
            {
                //make a new copy of monday
                const currentDate = new Date(startDate);

                //move forward however many days we are into the week
                currentDate.setDate(startDate.getDate() + i);

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
        }

        for (let i = 0; i < this.colHeadings.length; i++)
        {
            const thEle = document.createElement("th");

            if (weekOf)
            {
                // Use innerHTML instead of textContent
                // so we can add line breaks inside the table headings
                thEle.innerHTML = this.colHeadings[i];

                // If this is one of the weekday columns,
                // put the date above the weekday label
                // Example:
                // 5/25
                // MO
                if (i >= 3 && i <= 9)
                {
                    thEle.innerHTML = dates[i - 3] + "<br>" + this.colHeadings[i];
                }
            }
            else
            {
                thEle.textContent = this.colHeadings[i];
            }
            // Add the new heading to the row
            firstTrEle.append(thEle);
        }
    }


    /**
     * Populate a table cell with content
     * 
     * @param {HTMLTableDataCellElement} tdEle 
     * @param {number} row 
     * @param {number} col 
     * @returns {void}
     */
    populateTableElement(tdEle, row, col)
    {
        let isAdsPerWeekField = (col == 1);
        let isAdLengthField = (col == 2);
        let isCostField = (col == 11);
        let isSpecialRow = (row == this.height || row == this.height - 1);
        
        // If it's the second to last cell in the row, add in the delete div
        if (col == 12)
        {
             // Append the div with the td element (because that will be removed when clicked)
             tdEle.append(generateDeleteDiv("tr"));
        }
        else if (col == 13)
        {
            tdEle.append(generateCreateEvent());
        }
        else if (isSpecialRow)
        {
            return;
        }
        //Add ad length dropdown
        else if (isAdLengthField)
        {
            tdEle.append(this.createAdLengthDropdown());
        }
        //Create a blank span for ads/week
        else if (isAdsPerWeekField)
        {
            tdEle.append(createElement("span", null, "ads", "0"));
        }
        //If it's not a special element or already filled in it's a regular input field
        else if (!isCostField)
        {
            // Make a input field, give a type of number and min of 0
            const inputEle = document.createElement("input");
            inputEle.type = "number"
            inputEle.min = "0";
            // Append it to the td element
            tdEle.append(inputEle);
        }

    }

    /**
     * Populate a single row with cells
     * 
     * @param {HTMLElement} rowToPopulate 
     * @param {number} rowIndex 
     * @param {boolean} isNewRow 
     * @returns A row that has been populated
     */
    populateRow(rowToPopulate, rowIndex, isNewRow = false)
    {
        let dayPartValue = "";
        let dayPartPlaceholder = "";
        if (isNewRow)
        {
            dayPartValue = "";
            dayPartPlaceholder = "New Daypart";
        }
        else
        {
            dayPartValue = this.rowHeadings[rowIndex - 1];
            dayPartPlaceholder = "";
        }

        // For each column
        for (let col = 0; col < this.width; col++)
        {
            // Make a td element
            const tdEle = document.createElement("td");

            let isSpecialRow = (rowIndex == this.height || rowIndex == this.height - 1);
            let isAddDaypartRow = (rowIndex == this.height - 1);

            // Don't add utilities to special rows
            if (isSpecialRow && col >= 12) { continue; }

            if (col == 0)
            {
                // Don't make the weekly totals row editable
                if (isSpecialRow && !isAddDaypartRow)
                {
                    tdEle.textContent = dayPartValue;
                }
                else
                {
                    const dayPartField = createElement("textarea", null, "daypart-input");
                    dayPartField.value = dayPartValue;
                    dayPartField.placeholder = dayPartPlaceholder;
                    dayPartField.rows = 1;

                    // If this is the fake "+ Add Daypart" row,
                    // make it readonly and style it like a button
                    if (this.rowHeadings[rowIndex - 1] === "+ Add Daypart" && !isNewRow)
                    {
                        dayPartField.readOnly = true;
                        dayPartField.classList.add("add-daypart-button");

                        // When this fake button row is clicked,
                        // run the add row function
                        dayPartField.addEventListener("click", handleAddDaypartRow);
                        rowToPopulate.classList.add("add-daypart-row");
                    }
                    dayPartField.addEventListener("input", handleResizeDaypartTextarea);
                    tdEle.append(dayPartField);
                }
                // Add styling for daypart column
                tdEle.classList.add("time-slot");
            }
            else
            {
                this.populateTableElement(tdEle, rowIndex, col);
            }

            rowToPopulate.append(tdEle);
        }
        return rowToPopulate;
    }


    /**
     * This method creates the whole table (schedule) and then returns it.
     * 
     * @param {HTMLElement} generateScheduleElement 
     * @returns {HTMLDivElement} A div that contains the whole schedule
     */
    createWholeTable(generateScheduleElement)
    {
        const table = document.createElement("table")
        const tableBody = document.createElement("tbody");

        // Append tableBody to table
        table.append(tableBody);

        // Create the tr elements for the table
        const trEles = this.createTrElements();
        
        // Populate the first tr with the columns
        this.populateFirstTr(trEles[0], generateScheduleElement);

        // Populate the rest of the rows
        for (let row = 1; row < trEles.length; row++)
        {
            trEles[row] = this.populateRow(trEles[row], row);
        }

        // Add each row to the table
        for (let i = 0; i < trEles.length; i++)
        {
            tableBody.append(trEles[i]);
        }

        activeScheduleTables[table] = this;
        this.tableElement = table;

        // Return that table
        return table;
    }

    /**
     * This method creates a table and returns it.
     * 
     * @param {HTMLElement} element In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
     * @returns {HTMLTableElement} A table
     */
    buildTable(element)
    {
        // Create a container (div)
        const container = createElement("div", null, "table-container")

        // Create a div for the type of schedule h3 heading
        const h3Wrapper = createElement("div", null, "schedule-type-wrapper");

        // Create a h3 heading with Type of Schedule text
        const headingThree = createElement("h3", null, "schedule-type", getScheduleDate(element));

        // Append the h3 to the h3Wrapper div
        h3Wrapper.append(headingThree)

        // Append the h3 and the table to the div 
        container.append(h3Wrapper, this.createWholeTable(element));

        // Return the table
        return container;
    }


    /**
     * This method inserts the table into the DOM.
     * Specifically, it gets inserted above the closest div that has the element's class
     * 
     * @param {HTMLElement} element In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
     */
    insertTableToDOM(element)
    {
        // Build the table for that schedule
        const newTable = this.buildTable(element);

        //Add event listeners to the table
        newTable.addEventListener("input", handleInputEventForSchedules);
        newTable.addEventListener("paste", handlePasteEventForSchedules);
        newTable.addEventListener("keydown", handleKeyDownEventForSchedules);

        // Insert the table ABOVE the element (or before this element comes up)
        element.parentNode.insertBefore(newTable, element);
    }
}
