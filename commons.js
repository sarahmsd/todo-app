import { CATEGORIES, LocalStorageToArray } from "./storagemodule";
import { TABLEAU } from "./storagemodule";
import { body } from "./main";
import { displayTaks } from "./taskmodule";
//function to create an HTMLElement
export function createElement(elmt) {    
    return document.createElement(elmt);;
};

//function to stuff an element
export function stuffElement(e, content) { 
    return e.appendChild(document.createTextNode(content));
};

export function hide_zone(zone_to_hide, zone_to_show){
    zone_to_hide.setAttribute("style", "display: none;");
    zone_to_show.removeAttribute("style");
    LocalStorageToArray("CATEGORIES")
    displayTaks(CATEGORIES);
}

export function stuffCatsInSelect(cats, select) {
    let option;
    select.innerHTML = "";
    cats.forEach(item =>{
        option = createElement('option');
        option.setAttribute('value', item.name);
        stuffElement(option, item.name);
        select.appendChild(option);
    });
}

export function displayInput() {
    let input = document.getElementById('new_cat');
    input.removeAttribute('hidden');
    let btn = document.getElementById('add_new');
    btn.removeAttribute('hidden');
}

export function hideInput() {
    let input = document.getElementById('new_cat');
    input.setAttribute('hidden', "true");
    let btn = document.getElementById('add_new');
    btn.setAttribute('hidden', "true");
}

//function for create modal 
export function createModal (modal) {
    modal.removeAttribute("style");
    body.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.3)');
    window.addEventListener("focus", function() {
        closeModal(modal);
    }, false);
}

//function to close a modal
export function closeModal(modal) {
    modal.setAttribute("style", "display : none");
    body.removeAttribute('style');
}

//function to get categories by logged user
export function getCatByUser(user) {
    LocalStorageToArray("TABLEAU");    
    var cats = [];
    TABLEAU.forEach(item =>{
        if(item.user.username === user.username){
            cats = item.categories;
        }
    });
    return cats;
};

//function notify user
export function notify_user(message="", color="") {  
    var notif = document.getElementById('notif');
    notif.firstElementChild.firstElementChild.innerHTML = "";
    notif.setAttribute('style', 'display: null;');
    if(color === "success") notif.setAttribute('style', 'background-color: green;');
    if(color === "danger") notif.setAttribute('style', 'background-color: red;');
    if(color === "warning") notif.setAttribute('style', 'background-color: yellow;');
    stuffElement(notif.firstElementChild.firstElementChild, message);  
}