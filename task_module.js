import { displayCats, getSelectedCat, addCategory, createCategory } from "./category_module";
import { LocalStorageToArray, setLocalStorageContent, setStorageContentCat, setStorageContentTask, USER, CATEGORIES, TABLEAU, TASKS } from "./storage_module";
import { createModal, closeModal, notify_user, stuffElement, createElement, stuffCatsInSelect, getCatByUser, hide_zone, hideInput } from "./commons";

export let btn_open_main_modal = document.getElementById("add-task-plus");
export let btn_close_main_modal = document.getElementById('closeModal');
export let task_category = document.getElementById("md-task-category");
export let main_modal = document.getElementById("task-modal");
export let task_name = document.getElementById("md-task-name");
export let task_desc = document.getElementById("md-task-description");
export let md_btn_add_task = document.getElementById("md-btn-add-task");
export let bloc_task = document.getElementById("all_tasks");

export function listTasksByMenu(menu){    
    let c = false;
    //Stuff the ARRAYS WHITH STORAGE CONTENT
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("USER");
    //declaration d'un tableau ou on mettra la category trouver pour respecter la structure
    let tab = [];
    //SEARCH THE CATEGORY
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){ 
            if(menu === "all"){
                displayTaks(item.categories);
                c = true;
            }else if(menu === "mines"){
                c = true;
            }else if(menu === "for_others"){
                c = true;
            }else if(menu === "on_going"){
                c = true;
            }else if(menu === "done"){
                displayDoneTasks(item.categories);
                c = true;
            }
        }
    });

    if(c === false){            
        notify_user("Echec de tri de tâches", "danger");
    }
}

function displayDoneTasks(cats, cat_name="done") {
    let h2, br, div, hr, p1, input, span, p2, i1, i2, i3;
    bloc_task.innerHTML = "";
    h2 = createElement("h2");
    if(cat_name === "done") stuffElement(h2, "Tâches terminées");
    br = createElement("br");
    bloc_task.appendChild(h2);
    bloc_task.appendChild(br);
    cats.forEach(item=> {
        item.tasks.forEach(i=>{           
            if(i.done === true){
                createDivTask(div, hr, p1, input, span, p2, i1, i2, i3, i, item);
            }     
        });
    });
}

//function create task
export function createTask(name, desc="", done="", priority) {
    let task = {};
    if(name !== undefined && desc !== undefined){ 
        task.name = name;
        task.desc = desc;
        task.done = done;
        task.priority = priority;            
        return task; 
    }else{
        return false;
    }   
};

//function add task
export function addTask(task, cat) {
    if(task === false){
        notify_user("Echec d'ajout de la tâche", "danger");
    }else{
        LocalStorageToArray("CATEGORIES"); 
        LocalStorageToArray("TABLEAU");
        LocalStorageToArray("USER")
        LocalStorageToArray("TASKS");
        
        if(Object.keys(task).length !== 0) {

            TASKS.push(task);
            CATEGORIES.forEach(item=>{
                if(item.name === cat){                
                    item.tasks.push(task);
                }
            });
            TABLEAU.forEach(item1=>{  
                if(item1.user.username === USER.username){   
                    item1.categories = CATEGORIES;
                }
            });

            setStorageContentTask(TASKS);
            setStorageContentCat(CATEGORIES);
            setLocalStorageContent(TABLEAU);  
            displayTaks(CATEGORIES);
            displayCats(CATEGORIES);
            notify_user("Tâche ajoutée avec succès", "success");
        }        
    } 
};


//FUNCTIONS TO EDIT TASKS

//function to get the selected task
export function getSelectedTask(item) {
    let p = item.parentNode;
    let checked = p.firstElementChild;
    let task_name = checked.nextSibling.textContent;
    if(task_name == "" || task_name == undefined){
        task_name = p.parentNode.firstElementChild.nextSibling.textContent;
    }
    let task;
    LocalStorageToArray("USER");
    LocalStorageToArray("TABLEAU");
    TABLEAU.forEach((item2) =>{
        if(item2.user.username === USER.username){
            item2.categories.forEach((item1) => {
                item1.tasks.forEach((i) =>{
                    if(i.name === task_name) task = i;
                });
            });
        }
    });
    return task;
};

//function to hide task zone and show edit zone
export function showEditZone(edit_zone, zone_to_hide) {
    zone_to_hide.parentNode.appendChild(edit_zone);
}

function createDivTask(div, hr, p1, input, span, p2, i1, i2, i3, i, item, i4) {
    div = createElement("div");
    div.className = "task";
    hr = createElement("hr");
    p1 = createElement("p");
    p2 = createElement("p");
    p2.className = "sous-bloc";            
    input = createElement("input");
    input.className = "checkbox";
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "done");
    input.setAttribute("id", "checkbox"); 
    input.addEventListener('click', function(e){
        done_task(e);
        e.stopPropagation();
    }); 
    span = createElement("span");
    span.className = "right-bloc";
    i1 = createElement("i");
    i1.className = "fa fa-edit";
    i1.addEventListener("click", function(e){
        showEditZone(createEditZone(getSelectedTask(e.target), e.target), e.target.parentNode.parentNode);
        e.target.parentNode.parentNode.setAttribute("style", "display:none;");
        e.target.parentNode.parentNode.nextElementSibling.setAttribute('style', "display:none");
        e.stopPropagation();
    });      
    i2 = createElement("i");
    i2.className = 'fa fa-trash';
    i2.addEventListener('click', function(e){
        delete_task(e);
        e.stopPropagation();
    });           
    i3 = createElement("i");
    i3.className = "fa fa-flag";
    i3.addEventListener("dblclick", function(e){
        e.stopPropagation();
    });
    i4 = createElement("i");
    stuffElement(i4, item.name); 
    i4.addEventListener("dblclick", function(e){
        showEditZone(createEditZoneForTaskCat(getSelectedCat(e.target), e.target.parentNode), e.target.parentNode);
        e.target.parentNode.setAttribute("style", "display:none;");
        e.target.setAttribute("style", "display: none;");
        e.stopPropagation();
    });
    if(i.done === true){
        input.checked = true;
        input.setAttribute("style", "background-color: green");
        p1.setAttribute("style", "color: green");
    }
    p1.appendChild(input);
    stuffElement(p1, i.name);
    p1.appendChild(span);
    span.appendChild(i1);
    span.appendChild(i2);
    p2.appendChild(i3);
    p2.appendChild(i4);          
    div.appendChild(hr);
    div.appendChild(p1);
    div.appendChild(p2);
    bloc_task.appendChild(div);
}

//function to create edit zone
export function createEditZone(task, item) {
    let div = createElement("div");
    div.setAttribute("id","edit_zone");
    div.setAttribute("style", "dsiplay : none;");
    let p = createElement("p");
    let input = createElement("input");
    input.type = "text";
    input.value = task.name;
    input.className = "form-class";
    input.setAttribute("style", "width: 600px;");
    let btn_add = createElement("input");
    btn_add.type = "button";
    btn_add.value="editer";
    btn_add.className = "btn-class";
    btn_add.addEventListener("click", function(e){
        validate_edit(e, task.name);
        e.stopPropagation();
    });
    let btn_reset = createElement('input');
    btn_reset.type = "button";
    btn_reset.value = "Annuler";
    btn_reset.addEventListener('click', function(e) {
        reset_edit(item, e);
        e.stopPropagation();
    });
    p.appendChild(input);
    div.appendChild(p);
    div.appendChild(btn_add);
    div.appendChild(btn_reset);    
    return div;
};

//FUNCTION TO MAKE TASK DONE
function done_task(e){
    let task_to_done = getSelectedTask(e.target);
    let undone = false;
    let c1 = false; let c2 = false; //Variable de confirmation pour le TABLEAU et les CATEGORIES
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1) =>{
                item1.tasks.forEach((item2) =>{
                    if(item2.name === task_to_done.name){
                        item2.done = e.target.checked;
                        c1 = true;
                    }
                });
            });
        }
    });    

    CATEGORIES.forEach((item) =>{
        item.tasks.forEach((item2) =>{
            if(item2.name === task_to_done.name){
                item2.done = e.target.checked;
                if(e.target.checked === false) undone = true;
                c2 = true;
            }
        });
    });

    if(c1 === true && c2 === true){
        let msg = "";
        setLocalStorageContent(TABLEAU);
        setStorageContentCat(CATEGORIES);
        displayTaks(CATEGORIES);
        displayCats(CATEGORIES);
        if(undone === true) msg = "Tâche marquée comme non accomplie";
        else msg = "Tâche marquée comme accomplie";
        notify_user(msg, "success");
    }else{
        notify_user("Echec", "danger");
    }
}

function getSelectedItem(e){
    let select = e.target.parentNode.firstElementChild;
    let selectedItem = select.options[select.selectedIndex].value;
    return selectedItem;
}

var getTaskOfTheCat = function(e){
    let task_name = e.target.parentNode.parentNode.firstElementChild.nextElementSibling.firstElementChild.nextSibling.textContent;
    return task_name;
}

function delete_task_to_the_old_cat(cat_to_edit, task_name){
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");
    let task1, task2;

    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1) =>{
                if(item1.name === cat_to_edit.name){
                    item1.tasks.forEach((t, index) =>{
                        if(t.name === task_name){
                            task1 = t;
                            item1.tasks.splice(index, 1);
                        }
                    });                    
                }
            }); 
        }       
    });

    CATEGORIES.forEach((item) =>{
        item.tasks.forEach((t, index) =>{
            if(t.name === task_name){
                task2 = t;
                item.tasks.splice(index, 1);
            }
        });
    });

    if(task1.name === task2.name){
        return task2;
    }
}

function edit_cat_task(e, cat_to_edit){    
    let selectedItem = getSelectedItem(e);    
    let task_name, task;
    let c1, c2 = false;
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");

    //On verifie que la catégorie a été modifiée
    if(cat_to_edit.name !== selectedItem){
        //On recupère la tâche en question
        task = delete_task_to_the_old_cat(cat_to_edit, getTaskOfTheCat(e));        
        TABLEAU.forEach((item) =>{
            if(item.user.username === USER.username){
                item.categories.forEach((item1) =>{
                    if(item1.name === selectedItem){
                        item1.tasks.push(task);
                        c1 = true;
                    }
                });
            }
        });    
    
        CATEGORIES.forEach((item) =>{
            if(item.name === selectedItem){
                item.tasks.push(task);
                c2 = true;
            }
        });
    }          

    if(c1 === true && c2 === true){
        if(confirm("Valider la modification de la catégorie?")){
            setLocalStorageContent(TABLEAU);
            setStorageContentCat(CATEGORIES);
            displayTaks(CATEGORIES);
            displayCats(CATEGORIES);
            notify_user("Modifiaction de la catégorie réussie!!", "warning");
        }
    }else{
        notify_user("Echec de modification de la catégorie", "danger");
    }
}

function createEditZoneForTaskCat(cat, zone_to_hide){
    let p = createElement("p");
    let select = createElement("select");
    LocalStorageToArray("USER");
    stuffCatsInSelect(getCatByUser(USER), select);
    let btn_edit = createElement('input');
    btn_edit.type = "button";
    btn_edit.value = "Modifier";
    btn_edit.className = "btn-add";
    btn_edit.addEventListener('click', function(e){
        edit_cat_task(e, cat);
        hide_zone(p, zone_to_hide)
    });
    let btn_reset = createElement("input");
    btn_reset.type = "button";
    btn_reset.value = "Annuler";
    btn_reset.className = "btn-class";
    btn_reset.addEventListener('click', function(e){
        hide_zone(p, zone_to_hide);
        LocalStorageToArray("CATEGORIES");
        displayCats(CATEGORIES);
    });

    p.appendChild(select);
    p.appendChild(btn_edit);
    p.appendChild(btn_reset);
    
    return p;
}

//function to validate edit
function validate_edit(e, task_to_edit) {
    let task_name = e.target.parentNode.firstElementChild.firstElementChild.value;
    let c1 = false; let c2 = false; //Variable de confirmation pour le TABLEAU et les CATEGORIES
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1) =>{
                item1.tasks.forEach((item2) =>{
                    if(item2.name === task_to_edit){
                        item2.name = task_name;
                        c1 = true;
                    }
                });
            });
        }
    });    

    CATEGORIES.forEach((item) =>{
        item.tasks.forEach((item2) =>{
            if(item2.name === task_to_edit){
                item2.name = task_name;
                c2 = true;
            }
        });
    });

    if(c1 === true && c2 === true){
        setLocalStorageContent(TABLEAU);
        setStorageContentCat(CATEGORIES);
        displayTaks(CATEGORIES);
        notify_user("Tâche modifiée avec succès", "success");
    }else{
        notify_user("Echec de modification de la tâche", "danger");
    }
};

//function to reset edit
function reset_edit(item, e) {
    item.parentNode.parentNode.removeAttribute("style");
    item.parentNode.parentNode.nextElementSibling.removeAttribute("style");
    e.target.parentNode.setAttribute("style", "display: none;");
}

//FUNCTIONS TO DELETE TASKS
function delete_task (e){
    let task_to_delete = e.target.parentNode.parentNode.firstElementChild.nextSibling.textContent;
    let c1 = false, c2 = false;
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1) =>{
                item1.tasks.forEach((item2, index) =>{
                    if(item2.name === task_to_delete){                        
                        item1.tasks.splice(index, 1);   
                        c1 = true;                     
                    }
                });
            });
        }
    });
    
    CATEGORIES.forEach((item) =>{
        item.tasks.forEach((item2, index) =>{
            if(item2.name === task_to_delete){
                item.tasks.splice(index, 1);
                c2 = true;
            }
        });
    });
    if(c1 === true && c2 === true){
        if(confirm("Voulez-vous raiment supprimer cette tâche")){
            setLocalStorageContent(TABLEAU);
            setStorageContentCat(CATEGORIES);
            displayTaks(CATEGORIES);
            displayCats(CATEGORIES);
            notify_user("Suppression de la tâche réussie!!", "success");
        }
    }else{
        notify_user("Echec de suppression de la tâche", "danger");
    }
}

export function displayTaks(cats, cat_name = ""){
    let h2, br, div, hr, p1, input, span, p2, i1, i2, i3;
    bloc_task.innerHTML = "";
    h2 = createElement("h2");
    if(cat_name === "") stuffElement(h2, "Toutes les tâches");
    else stuffElement(h2, "Liste des Tâches de la catégorie "+cat_name);   
    br = createElement("br");
    bloc_task.appendChild(h2);
    bloc_task.appendChild(br);
    cats.forEach(item=> {
        item.tasks.forEach(i=>{           
            if(i.done === false){
                createDivTask(div, hr, p1, input, span, p2, i1, i2, i3, i, item);
            }     
        });
    });
}

//FUNCTION TO LIST TASKS BY CAT
export function listTaskByCat(e){        
    let cat_name = e.target.firstElementChild.nextSibling.textContent;    
    let c = false;  
    //Stuff the ARRAYS WHITH STORAGE CONTENT
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("USER");
    //declaration d'un tableau ou on mettra la category trouver pour respecter la structure
    let tab = [];
    //SEARCH THE CATEGORY
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){            
            item.categories.forEach((item1) =>{
                if(item1.name === cat_name){
                    tab.push(item1);
                    c = true;
                }
            });
        }
    });

    if(c === true){        
        displayTaks(tab, cat_name);
    }else{
        notify_user("Echec de tri de tâches", "danger");
    }

};

///MANAGE TASKS

btn_open_main_modal.addEventListener("click", function() {
    createModal(main_modal);
    LocalStorageToArray("CATEGORIES");
    stuffCatsInSelect(CATEGORIES, task_category);
}, false);

btn_close_main_modal.addEventListener("click", function (){
    closeModal(main_modal);
}, false);

form_add_task.addEventListener("reset", function() {
    closeModal(main_modal);
    task_name.value = "";
    task_desc.value = "";
    task_category.value = "";
}, false);


form_add_task.addEventListener('submit', function (e) {   
    e.stopPropagation();
    e.preventDefault();
    addTask(createTask(task_name.value, task_desc.value, false, 1), task_category.value);  
    closeModal(main_modal);  
});



let newCat = document.getElementById("new");
newCat.addEventListener("click", function () {
   displayInput(); 
});
let btn_new = document.getElementById("add_new");
btn_new.addEventListener('click', function () {
    let input = document.getElementById('new_cat');
    task_category.value = input.value;
    task_category.selectedIndex = input;
    addCategory(createCategory(input.value));
    stuffCatsInSelect(getCatByUser(USER), task_category);
    hideInput();
    displayCats(getCatByUser(USER));
    stuffCatsInSelect(getCatByUser(USER), task_category);
    displayCatSelectedWhenCreateTask(input.value);
});

let menus = document.querySelectorAll(".menu-bloc .li_menu");
menus.forEach((item, key)=>{
    item.addEventListener('click', function(e){
        listTasksByMenu(item.firstElementChild.id);
    });
});