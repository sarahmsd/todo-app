import { LocalStorageToArray, setLocalStorageContent, setStorageContentCat, CATEGORIES, TABLEAU, USER } from "./storage_module";
import { createModal, closeModal, notify_user, createElement, hide_zone, stuffElement, getCatByUser } from "./commons";
import { displayTaks, showEditZone, listTaskByCat, listTasksByMenu } from "./task_module";

export let sidebar_cats = document.getElementById("list-cat");

//SET THE CATEGORIES IN THE MAIN ARRAY
function setMainArray(categories) {
    var tableau = {};
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");    
    if(USER.length !== 0){
        tableau.user = USER;
        tableau.categories = categories;
    }
    return tableau;
};

function addMainArray(tableau) {
    LocalStorageToArray("TABLEAU");  
    //Si le tableau envoyé n'est pas vide      
    if(Object.keys(tableau).length !== 0){
        //Si le tableau principal TABLEAU n'est pas vide (S'il est vide pas beson de verification on ajoute directement une ligne avec le user et les categories)
        //On recherche l'user connécté
        //S'il existe déjà on mets à jour sa colonne catégories
        //Sinon on ajoute une nouvelle ligne dans la table
        if(Object.keys(TABLEAU).length !== 0){
            TABLEAU.forEach(item =>{
                if(item.user.username === USER.username){
                    item.categories = tableau.categories;
                }else{
                    TABLEAU.push(tableau);
                }
            });
        }else{
            TABLEAU.push(tableau);
        }
    }
    setLocalStorageContent(TABLEAU);
};

//CATEGORIES FUNCTIONS
//function for add a category
export function createCategory(name, color, icone) {
    var category = {}, task = []; 
    if(name === undefined){
        return false;
    }else{   
        category.name = name;
        if(color === undefined){
            category.color = 'default';
        }else{
            category.color = color;
        }
        if(icone === undefined){
            category.icone = 'default';
        }else{
            category.icone = icone;
        }
        category.tasks = task;
        return category
    }
};

//function add category to CATEGORIES
export function addCategory(category) {
    let cat_exist = false;
    if(category === false){
        notify_user("Echec d'ajout de la catégorie", "danger");
    }else{
        LocalStorageToArray("CATEGORIES");  
        CATEGORIES.forEach((item) =>{
            if(item.name === category.name){
                notify_user("Cette catégorie existe déjà", "warning");
                cat_exist = true;
            }
        });   
        if(cat_exist === false){
            CATEGORIES.push(category);
            setStorageContentCat(CATEGORIES);
            addMainArray(setMainArray(CATEGORIES));
            displayCats(getCatByUser(USER));
            notify_user("Catégorie créée avec succès", "success");
        }               
    } 
};

function edit_category(e, cat_to_edit){
    let cat_name = e.target.parentNode.firstElementChild.value;
    let cat_icone = e.target.parentNode.firstElementChild.nextElementSibling.nextSibling.value;
    let cat_color = e.target.parentNode.firstElementChild.nextSibling.value;
    let c1 = false; let c2 = false; //Variable de confirmation pour le TABLEAU et les CATEGORIES    
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1) =>{
                if(item1.name === cat_to_edit.name){
                    item1.name = cat_name;
                    item1.color = cat_color;
                    item1.icone = cat_icone;
                    c1 = true;
                }
            });
        }
    });    

    CATEGORIES.forEach((item) =>{
        if(item.name === cat_to_edit.name){
            item.name = cat_name;
            item.color = cat_color;
            item.icone = cat_icone;
            c2 = true;
        }
    });

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

function createEditZoneForCat(cat, zone_to_hide){
    let p = createElement("p");
    let input = createElement("input");
    input.type = "text";
    input.value = cat.name;
    input.setAttribute("style", "whidth: 200px;");
    input.className = "form-class";

    let color = createElement("input");
    color.value = cat.color;
    color.className = "form-class";
    color.setAttribute("style", "whidth: 200px;");

    let icone = createElement("input");
    icone.value = cat.icone;
    icone.className = "form-class";
    icone.setAttribute("style", "whidth: 200px;");

    let btn_edit = createElement('input');
    btn_edit.type = "button";
    btn_edit.value = "Modifier";
    btn_edit.className = "btn-add";
    btn_edit.addEventListener('click', function(e){
        edit_category(e, cat);
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

    p.appendChild(input);
    p.appendChild(color);
    p.appendChild(icone);
    p.appendChild(btn_edit);
    p.appendChild(btn_reset);
    
    return p;
}

export let getSelectedCat = function(item){ 
    let span = item.parentNode;
    let a = span.parentNode;
    let cat_name = a.firstElementChild.nextSibling.textContent;
    let cat;
    LocalStorageToArray("CATEGORIES");
    CATEGORIES.forEach((item) =>{
        if(item.name === cat_name) cat = item;
    });
    
    if(cat === undefined){
        cat_name = span.firstElementChild.nextSibling.textContent;
        CATEGORIES.forEach((item) =>{
            if(item.name === cat_name) cat = item;
        });
    }
    return cat;
}

//FUNCTIONS TO DELETE CAT
function delete_category (e){
    var cat_to_delete = getSelectedCat(e);
    var c1 = false, c2 = false;
    LocalStorageToArray("TABLEAU");
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");    
    TABLEAU.forEach((item) =>{
        if(item.user.username === USER.username){
            item.categories.forEach((item1, index) =>{                  
                if(item1.name === cat_to_delete.name){                                            
                    item.categories.splice(index, 1);   
                    c1 = true;  
                }
            });
        }
    });
    
    CATEGORIES.forEach((item, index) =>{
        if(item.name === cat_to_delete.name){
            CATEGORIES.splice(index, 1);
            c2 = true;
        }
    });
    if(c1 === true && c2 === true){
        if(confirm("Voulez-vous vraiment supprimer cette catégorie?Cela implique la suppression de toutes les tâches se rapportant à cette catégorie!!")){
            setLocalStorageContent(TABLEAU);
            setStorageContentCat(CATEGORIES);
            displayTaks(CATEGORIES);
            displayCats(CATEGORIES);
            notify_user("Suppression de la catégorie réussie!!", "success");
        }
    }else{
        notify_user("Echec de suppression de la catégorie", "danger");
    }
};

export function displayCats(cats) {
    let li, a, i, span, i_delete, i_edit, badge;
    sidebar_cats.innerHTML = "";
    cats.forEach(item =>{
        li = createElement('li');
        li.className = "li-cat";
        li.addEventListener("click", function(e){
            listTaskByCat(e);
            e.stopPropagation();
        });
        a = createElement('a');
        i = createElement('i');
        i.className = "fas fa-"+item.icone;
        badge = createElement("i");
        badge.className = "badge";
        stuffElement(badge, get_badge(item));

        span = createElement("span");
        span.className = "right-bloc-cat"; 

        i_edit = createElement('i');        
        i_edit.className = "fas fa-pen";        

        i_delete = createElement('i');    
        i_delete.className = "fas fa-trash";
              

        a.setAttribute("href","#"+item.name);
        a.appendChild(i);

        stuffElement(a, item.name);

        a.appendChild(badge);

        span.appendChild(i_edit);
        span.appendChild(i_delete);        
        a.appendChild(span);            
        li.appendChild(a);        

        i_delete.addEventListener("click", function(e){
            e.stopPropagation();
            delete_category(e.target);
        });

        i_edit.addEventListener("click", function (e) {
            showEditZone(createEditZoneForCat(getSelectedCat(e.target), e.target.parentNode.parentNode), e.target.parentNode.parentNode);
            e.target.parentNode.parentNode.setAttribute("style", "display:none;");
            e.target.parentNode.setAttribute("style", "display: none;");
            e.stopPropagation();
        });
        sidebar_cats.appendChild(li);   
    });
}

let get_badge = function(cat) {
    let total = cat.tasks.length;
    let done = 0;
    cat.tasks.forEach((item) =>{
        if(item.done === true){
            done = done + 1;
        }
    });
    return done+" / "+total;
};


export function displayCatSelectedWhenCreateTask(cat) {
    let span = document.getElementById("band");  
    span.innerHTML = "";  
    stuffElement(span, cat);
    span.className = "banderolle";    
}



//MANAGE CATEGORIES
export let cat_name = document.getElementById("cat-name");
export let cat_color = document.getElementById("cat-color");
export let cat_icone = document.getElementById("cat-icone");
export let category_modal = document.getElementById("category-modal");
export let btn_open_modal_cat = document.getElementById("add-cat-plus");
export let btn_close_modal_cat = document.getElementById('closeModalCategory');
export let btn_reset_cat = document.getElementById('md-btn-reset_cat');
export let md_btn_add_cat = document.getElementById("md-btn-add-cat");

btn_open_modal_cat.addEventListener('click', function() {
    createModal(category_modal);
}, false);

btn_close_modal_cat.addEventListener('click', function(){
    closeModal(category_modal);
});

form_add_cat.addEventListener("reset", function(){
    closeModal(category_modal);
});

form_add_cat.addEventListener("submit", function(e){
    e.stopPropagation();
    e.preventDefault();
    addCategory(createCategory(cat_name.value, cat_color.value, cat_icone.value));  
    closeModal(category_modal);
});