import { LocalStorageToArray, USER } from "./storagemodule.js";
import { getCatByUser, stuffCatsInSelect, stuffElement } from "./commons.js";
import { displayCats } from "./categorymodule.js";
import { task_category, displayTaks } from "./taskmodule.js";
import { inscription_div, connexion_div } from "./usermodule.js";

export let body = document.body;
export let main_div = document.getElementById('main_div');

//Function principal
(function () {
    LocalStorageToArray("USER");
    let user_signed = USER;
    if(Object.keys(user_signed).length !== 0){
        LocalStorageToArray(USER);
        main_div.setAttribute("style", "display: null;");
        connexion_div.setAttribute("style", "display: none;");
        inscription_div.setAttribute("style", "display: none;");          
        displayCats(getCatByUser(user_signed));
        displayTaks(getCatByUser(user_signed));
        stuffCatsInSelect(getCatByUser(user_signed), task_category);
        document.getElementById('signed_user').innerHTML='';
        stuffElement(document.getElementById('signed_user'), user_signed.username);
    }    
})();


/*_________________________________________MODAL DE NOTIFICATION______________________________________________*/
let btnNotif = document.getElementById('close-notif');
let notif = document.getElementById('notif');
btnNotif.addEventListener('click', function(){
    notif.setAttribute('style', 'display: none;');
});
/*_________________________________________/MODAL DE NOTIFICATION______________________________________________*/
