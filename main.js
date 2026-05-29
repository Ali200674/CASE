/**
 * @file This file will be the main entry for this website. It will hold all of the event listeners
 * like making the table, listening for input, etc. This is so we can hide all of the actual logic in a different
 * js file.
 * 
 * @author Ali Izoyev
 * @author Colin Rice 
 * @version 1.0.0
 * @module main.js
 */

// This will add an event listener to the addClientButton to let it add sections for clients
window.onload = () =>
{
    const addClientButton = document.getElementById("add-client-button");
    addClientButton.addEventListener("click", createClientSection);
}