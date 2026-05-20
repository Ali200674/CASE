//Contains miscellaneous utilities used throughout

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
 * This method creates a reusable delete button element with a trash can icon. It also activates a popup behavior that is already
 * in the html. When the trash can is clicked, the user will be ask to confirm deletion before removing the target element (element as parameter)
 * in the DOM. If you need something else to happen when the button is clicked besides the deletion of the tag, you need to implement it inside of this function,
 * inside of the event listener
 * 
 * element: The element that will be used for deletion when the user approves there desision.
 * 
 * return: A reusable div with a delete button, trash can icon, and some behavior tied to the button / trash can
 */
function generateDeleteDiv(element)
{
    // Create a container (div) that will hold everything
    const deleteContainer = createElement("div", undefined, "delete-container", undefined);

    // Create a button that will be used for clicking
    const deleteButton = createElement("button", undefined, "delete-button", undefined);

    // Create a event listener for the button for clicked
    deleteButton.addEventListener("click", (event) =>
    {
        // Using what triggered the button, we will find the closest tag given as a paramenter
        // Note: The closest method goes up the DOM to find the element
        const closestElement = event.target.closest(element);

        // Get all of the other tags needed
        const yesButton = document.querySelector(".yes-button");
        const noButton = document.querySelector(".no-button");
        const confirmSection = document.querySelector(".confirm-section");
        const overlay = document.querySelector(".overlay");
        confirmSection.style.display = "block";
        overlay.style.display = "block";

        // Event listener for the yes button
        yesButton.onclick = () =>
        {

            // If the element given is a tr (meaning we will delete a row from a table)
            if (element === "tr")
            {
                // Get the tbody element (closest)
                const closestTbody = closestElement.closest("tbody");
                
                // Remove it
                closestElement.remove();

                // If the tbody tag has only two elements (heading and weekly totals), remove the whole table completly
                if (closestTbody.children.length === 2)
                {
                   closestTbody.closest(".table-container").remove();
                }
                else
                {
                    // Re-calculate the totals
                    getAllTotals(closestTbody);
                }      
            }
            else // Else, just remove the element
            {
                closestElement.remove();
            }

            // Hide the confirm and overlay elements
            confirmSection.style.display = "none";
            overlay.style.display = "none";

        }

        // If no was clicked, then just hide it 
        noButton.onclick = () =>
        {
            confirmSection.style.display = "none";
            overlay.style.display = "none"
        }
    })

    // Make a img tag with it's src to the trash can
    const trashCanImage = createElement("img", undefined, "trash-can-image", undefined);
    trashCanImage.src = "trash can.png";

    // Append the trash can to the button and button to container
    deleteButton.append(trashCanImage);
    deleteContainer.append(deleteButton);

    // Return the div
    return deleteContainer;
    
}

