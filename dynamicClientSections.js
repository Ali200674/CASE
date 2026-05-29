/**
 * @file This file handles the creation of sections and and the schedule selection controls used to make a table within each section
 * 
 * @author Ali Izoyev
 * @version 1.0.0
 * @module dynamicClientSections.js
 */


/**
 * This method creates and returns a section containing an input field for the clients name
 * based on the options in the datalist
 * 
 * @returns {HTMLDivElement} The generated client section
 */
function generateSection()
{
    // Make main section
    const div = createElement("div", undefined, "section", undefined)

    // Make section for h2 and deletion div
    const sectionName = createElement("div", undefined, "section-name", undefined)

    // Make h2 with clients name
    const clientName = createElement("input", undefined, "client-name", undefined);

    clientName.setAttribute("list", "station-list");
    clientName.placeholder = "Station Name";

    //so you can press enter in a field
    clientName.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            clientName.blur();
        }
    })

    // Append the client name (h2) and the deletion div that will delete the section
    sectionName.append(clientName);
    sectionName.append(generateDeleteDiv(".section"));

    // Put section that has the h2 and the delete div inside of the main div
    div.append(sectionName);

    // Return div
    return div;
}


/**
 * This method generates the clients section and inserts it into the page
 */
function createClientSection()
{
    // Generate the main section
    const newClient = generateSection();

    // Create the scheduling creation div
    newClient.append(generateNewSchedule())

    // Find the div that adds the clients
    const addClient = document.querySelector("#add-client");

    // Append the new section above the div that adds the client
    addClient.parentNode.insertBefore(newClient, addClient);
    
}

/**
 * This method creates and returns a div for the schedule creation.
 * 
 * @returns {HTMLDivElement} The schedule creation div
 */
function generateNewSchedule()
{
    // Make div and give class
    const container = createElement("div", undefined, "generate-new-schedule", undefined);

    // Make p tag that holds the text "Type of Schedule"
    const pTypeOfSchedule = createElement("p", undefined, undefined, "Type Of Schedule:");

    container.append(pTypeOfSchedule);

    // Create selections
    const selections = createSelections();

    // Create each containers that holds the dates, the week container and month container
    const dateSelectors = createDateSelectionContainer();
    const weekContainer = createWeekContainer()
    const monthContainer = createMonthContainer();

    // Append those variables
    dateSelectors.append(weekContainer);
    dateSelectors.append(monthContainer);
    container.append(selections);
    container.append(dateSelectors);

    // Make a button to make a table
    const createSchedule = createElement("button", undefined, "make-schedule", "Generate New Schedule")

    /*
        Every button will be given this event listener. When clicked, it will find the closest tag with ".generate-new-schedule",
        then will add in a table above that section
    */
    createSchedule.addEventListener("click", handleCreateNewSchedule);

    // Append this button to the div
    container.append(createSchedule);

    /*
        Add another event listener. This one is for every div that has the week and month selection.
        It will find the closest tag with the ".generate-new-schedule" class, and show the week, month and if needed,
        the error message
    */
    selections.addEventListener("change", handleChangeEventForScheduleTypes);

    // Return this div
    return container;
}


/**
 * This method creates and returns the div that holds the error message and later hold on the date selector componentsd
 * 
 * @returns {HTMLDivElement} The date selector div
 */
function createDateSelectionContainer()
{
    // Make div 
    const container = createElement("div", undefined, "date-selections", undefined);

    // Make error message and give it a class, text, and set display to none.
    const errorMessageSpan = createElement("span", undefined, "error-message", "Input Field(s) Cannot Be Empty!");
    errorMessageSpan.style.display = "none";
    
    // Append to container and return
    container.append(errorMessageSpan);
    return container;

}

/**
 * This method creates and returns a div for the week range inputs
 * 
 * @returns {HTMLDivElement} The week selection div
 */
function createWeekContainer()
{
    // Make week container with class and set display to flex
    const weekContainer = createElement("div", undefined, "week-selection", undefined)
    weekContainer.style.display = "flex";

    // Make container for week ranges and has a class
    const weekRangeContainer = createElement("div", undefined, "week-range", undefined);

    // removed to adjust week selector to just give us one selection point since it doesn't generate multiple weeks
    
    // // Make week from text and input with a week type
    // const weekFrom = createElement("p", undefined, undefined, "From:");
    // const inputWeekFrom = createElement("input", undefined, "from-week", undefined)
    // inputWeekFrom.type = "week";

    // // Make week to text and input with a week type
    // const weekTo = createElement("p", undefined, undefined, "To:");
    // const inputWeekTo = createElement("input", undefined, "to-week", undefined)
    // inputWeekTo.type = "week";

    const weekOf = createElement("p", undefined, undefined, "Broadcast Week:");
    const inputWeek = createElement("input", undefined, "week-of", undefined)
    inputWeek.type = "week";
    inputWeek.title = "Select a broadcast week";

    // Append all to weekRangeContainer and then weekContainer
    weekRangeContainer.append(weekOf);
    weekRangeContainer.append(inputWeek);
    weekContainer.append(weekRangeContainer);

    // Return weekContainer
    return weekContainer;
}

/**
 * This method creates and returns a div for the month inputs
 * 
 * @returns {HTMLDivElement} The month selection div
 */
function createMonthContainer()
{
    // Make main container with class and display to none.
    const container = createElement("div", undefined, "month-selection", undefined);
    container.style.display = "none";

    // Make a month p tag 
    const fromMonth = createElement("p", undefined, undefined, "Month:");

    // Make a input for the month and give it a class and type
    const input = createElement("input", undefined, "month-choosen", undefined);
    input.type = "month"

    // Append fromMonth and input to container and return.
    container.append(fromMonth);
    container.append(input);
    return container;

}

/**
 * This method creates and returns a drop down selection of week or month.
 * 
 * @returns {HTMLDivElement} The dropdown for week and month div
 */
function createSelections()
{
    // Make select tag with class
    const select = createElement("select", undefined, "type-schedule", undefined);

    // Make week option with text and give it a value
    const optionOne = createElement("option", undefined, undefined, "Week")
    optionOne.value = "week";

    // Make a month option with text and give it a value 
    const optionTwo = createElement("option", undefined, undefined, "Month")
    optionTwo.value = "month";

    // Append both and return
    select.append(optionOne);
    select.append(optionTwo);
    return select;
}