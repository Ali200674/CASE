
class ScheduleTable {

    fromDate = null;
    toDate = null;

    colHeadings = ["DAYPART", "ads/wk", "Length", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "RATE", "COST"];
    defaultDayParts = ["Morning (7a-10a)", "Middays (10a-3p)", "Afternoons(3p-6:30p)", "Sa-Su 9a-2p", "M-Su 12M-12M Bonus"];
    rowHeadings = ["+ Add Daypart", "Totals:"];

    //Skip dayparts and ads/week
    columnsToSkipAtStart = 2;
    //Skip cost / other utility columns
    columnsToSkipAtEnd = 3;
    //Skip headers
    rowsToSkipAtStart = 1;
    //Skip weekly totals
    rowsToSkipAtEnd = 1;

    width = colHeadings.length + 2; // All columns + utilities (delete and calendar buttons)
    height = rowHeadings.length;
    tableElement = null;

    rowTotals = [];
    columnTotals = [0, null, 0, 0, 0, 0, 0, 0, 0, null, 0];

    // Initialize a table with the provided date range
    constructor(fromDate, toDate, prefillWithDefaultDayParts) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        if (prefillWithDefaultDayParts) {
            rowHeadings = defaultDayParts.concat(rowHeadings);
            height = rowHeadings.height;
        }
        //Initialize an empty array for each row's totals
        for (i = 0; i < height; i++) {
            rowTotals.push([]);
        }
    }

    /*
        This method will display the total of a row / column.
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

    /*
    Updates the ads/week and cost fields for the row provided.
    */
    updateTotalsForRow(singleRow, totals)
    {
        const cells = singleRow.children;

        const adsPerWeekCell = cells[1];
        const adsPerWeekTotal = totals[0];
        displayTotal(adsPerWeekCell, adsPerWeekTotal, false);

        // Move the costcell back one (because of deletion div)
        const costCell = cells[cells.length - columnsToSkipAtEnd];
        const costTotal = totals[totals.length - 1];
        displayTotal(costCell, costTotal, true);
    }

    /*
    Calculates all necessary totals for a row, updates this.rowTotals with an array containing each column value including the final total.
    Runs updateTotalsForRow to update the ads/week and cost fields with the new totals.

    Example addition to this.rowTotals:
    ads/week, length, mon, tues, wed, thur, fri, sat, sun, rate, cost
    [19, 1.0, 1, 5, 2, 1, 1, 5, 4, 5, 95]
    */
    calculateAndUpdateTotalsForRow(singleRow, rowIndex)
    {
        const cells = singleRow.children;

        // Loop through the cells in the row, skipping special cells
        for (let i = columnsToSkipAtStart; i < cells.length - columnsToSkipAtEnd; i++)
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
            rowTotals[rowIndex].push(value); // Add the value to the running total
        }

        // Create an array of just the ad counts
        // by slicing off the first and last elements (length and rate)
        let adCountsArray = totals.slice(1, -1);
        // Get the total amount of ads for the week
        let adsPerWeekTotal = adCountsArray.reduce((total, value) => total + value, 0);
        // Calculate cost by multiplying this by the rate
        let cost = adsPerWeekTotal * totals.at(-1);

        //Add these values to the array of totals
        rowTotals[rowIndex].unshift(adsPerWeekTotal);
        rowTotals[rowIndex].push(cost);
        updateTotalsForRow(singleRow, rowTotals[rowIndex]);
    }

    displayColumnTotals()
    {
        let rows = tableElement.children;
        for (let columnIndex = 0; columnIndex <= columnTotals.length; columnIndex++)
        {
            let finalColumnTotal = columnTotals[columnIndex];

            // Skip null column totals
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

    getAllTotals()
    {
        let rows = tableElement.children;
        // Loop through each row in the table, skipping headers and final totals
        for (let rowIndex = rowsToSkipAtStart; rowIndex < rows.length - rowsToSkipAtEnd; rowIndex++)
        {
            // Calculate the totals for this row
            this.calculateAndUpdateTotalsForRow(rowIndex);
            // Add totals for each column to column totals
            for (let totalIndex = 0; totalIndex < rowTotals.length; totalIndex++) {
                let rowTotal = rowTotals[rowIndex][totalIndex];
                // Skip null column totals (we don't need to calculate a total for this column)
                if (columnTotals[totalIndex] == null)
                {
                    continue;
                }
                columnTotals[totalIndex] += rowTotal;
            }
        }
        displayColumnTotals();
    }

    //Creates an ad length dropdown for use in a new table.
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

    //Creates and returns an array of rows for a new table
    createTrElements()
    {
        const trs = [];

        // Add an extra row for headings
        for (let i = 0; i < rowHeadings.length+1; i++)
        {
            trs.push(document.createElement("tr"));
        }

        // Return that array of tr elements
        return trs;
    }

    //Populates the first table row with column headings
    populateFirstTr(firstTrEle, generateScheduleElement)
    {
        const weekOf = generateScheduleElement.querySelector(".week-of");
        if (weekOf)
        {
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
        }

        for (let i = 0; i < colHeadings.length; i++)
        {
            const thEle = document.createElement("th");

            if (weekOf)
            {
                // Use innerHTML instead of textContent
                // so we can add line breaks inside the table headings
                thEle.innerHTML = colHeadings[i];

                // If this is one of the weekday columns,
                // put the date above the weekday label
                // Example:
                // 5/25
                // MO
                if (i >= 3 && i <= 9)
                {
                    thEle.innerHTML = dates[i - 3] + "<br>" + colHeadings[i];
                }
            }
            else
            {
                thEle.textContent = colHeadings[i];
            }
            // Add the new heading to the row
            firstTrEle.append(thEle);
        }
    }

    populateTableElement(tdEle, row, col)
    {
        let isAdsPerWeekField = (col == 1);
        let isAdLengthField = (col == 2);
        let isCostField = (col == 11);
        let isWeeklyTotalsRow = (row == this.height - 1);

        // If it's the second to last cell in the td, add in the delete div
        if (col == 12)
        {
             // Append the div with the td element (because that will be removed when clicked)
             tdEle.append(generateDeleteDiv("tr"));
        }
        else if (col == 13)
        {
            tdEle.append(generateCreateEvent());
        }
        //Add ad length dropdown
        else if (isAdLengthField)
        {
            tdEle.append(createAdLengthDropdown());
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

    populateRow(rowToPopulate, rowIndex, isNewRow = false)
    {
        if (isNewRow)
        {
            const dayPartValue = "";
            const dayPartPlaceholder = "New Daypart";
        }
        else
        {
            const dayPartValue = rowHeadings[rowIndex - 1];
            const dayPartPlaceholder = "";
        }

        // For each column
        for (let col = 0; col < this.width; col++)
        {
            // Make a td element
            const tdEle = document.createElement("td");

            let isWeeklyTotalsRow = (rowIndex == this.height - 1);

            // Don't add utilities to the last column
            if (isWeeklyTotalsRow && col >= 12) { continue; }

            if (col == 0)
            {
                // Don't make the weekly totals row editable
                if (isWeeklyTotalsRow)
                {
                    tdEle.textContent = rowHeadings[rowIndex - 1];
                }
                else
                {
                    const dayPartField = createElement("input", null, "daypart-input");
                    dayPartField.type = "text";
                    dayPartField.value = dayPartValue;
                    dayPartField.placeholder = dayPartPlaceholder;
                    tdEle.append(dayPartInputField);

                    // If this is the fake "+ Add Daypart" row,
                    // make it readonly and style it like a button
                    if (elementTitles[rowIndex - 1] === "+ Add Daypart")
                    {
                        dayPartInputField.readOnly = true;
                        dayPartInputField.classList.add("add-daypart-button");

                        // When this fake button row is clicked,
                        // run the add row function
                        dayPartInputField.addEventListener("click", handleAddDaypartRow);
                    }
                }
                // Add styling for daypart column
                tdEle.classList.add("time-slot");
            }
            else
            {
                tdEle = populateTableElement(tdEle, row, col));
            }

            rowToPopulate.append(tdEle);
        }
        return rowToPopulate;
    }

    /**
     * This method creates the whole table (schedule) and then returns it.
     * 
     * returns: the schedule.
     */
    createWholeTable(generateScheduleElement)
    {
        const table = document.createElement("table")
        const tableBody = document.createElement("tbody");

        // Append tableBody to table
        table.append(tableBody);

        // Create the tr elements for the table
        const trEles = createTrElements();
        
        // Populate the first tr with the columns
        populateFirstTr(trEles[0], generateScheduleElement);

        // Populate the rest of the rows
        for (let row = 1; row < trEles.length; row++)
        {
            trEles[row] = populateRow(trEles[row], row);
        }

        // Add each row to the table
        for (let i = 0; i < trEles.length; i++)
        {
            tableBody.append(trEles[i]);
        }

        this.tableElement = table;

        // Return that table
        return table;
    }

    /**
     * This method creates a table and returns it.
     * 
     * element: In this case, the closest element with the ".generate-new-schedule" tag to insert a new table
     * returns: A table
     */
    buildTable(element)
    {
        // Create a container (div)
        const container = createElement("div", null, "table-container")

        // Create a div for the type of schedule h3 heading
        const h3Wrapper = createElement("div", null, "schedule-type-wrapper");

        // Create a h3 heading with Type of Schedule text
        const headingThree = createElement("h3", null, "schedule-type", getTypeOfSchedule(element));

        // Append the h3 to the h3Wrapper div
        h3Wrapper.append(headingThree)

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
    insertTableToDOM(element)
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
}
