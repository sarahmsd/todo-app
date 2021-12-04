//Globals variables
var body = document.body;
var CATEGORIES = [];//Cette variable accueil les catégories d'un user spécifique
var TABLEAU = [];// CETTE VARIABLE CONTIENT TOUTES LES CATEGORIES ET TÂCHES CLASSES PAR USER
var TASKS = [];//CETTE VARIABLE CONTIENT TOUTES LES TÄCHES D4UN USER
var USERS = [];//CETTE VARIABLE CONTIENT TOUS LES UTILISATEURS INSCRITS
var USER = [];//CETTE VARIABLE CONTIENT LES INFOS DE L'USER CONNECTE
var main_div = document.getElementById('main_div');

//GETTIN THE CHAMPS FORMS
var cat_name = document.getElementById("cat-name");
var cat_color = document.getElementById("cat-color");
var cat_icone = document.getElementById("cat-icone");
var task_name = document.getElementById("md-task-name");
var task_desc = document.getElementById("md-task-description");
var task_category = document.getElementById("md-task-category");
var md_btn_add_task = document.getElementById("md-btn-add-task");
var md_btn_add_cat = document.getElementById("md-btn-add-cat");
var modal_profil = document.getElementById("profil_modal");
var category_modal = document.getElementById("category-modal");
var main_modal = document.getElementById("task-modal");
var bloc_task = document.getElementById("all_tasks");
var main_modal = document.getElementById("task-modal");
var btn_open_main_modal = document.getElementById("add-task-plus");
var btn_close_main_modal = document.getElementById('closeModal');
var md_btn_reset_task = document.getElementById("md-btn-reset-task");
var btn_open_modal_cat = document.getElementById("add-cat-plus");
var btn_close_modal_cat = document.getElementById('closeModalCategory');
var btn_reset_cat = document.getElementById('md-btn-reset_cat');
var select_cat_modal = document.getElementById("md-task-category");


//function to close a modal
function closeModal(modal) {
    modal.setAttribute("style", "display : none");
    body.removeAttribute('style');
}


//function for create modal 
function createModal (modal) {
    modal.removeAttribute("style");
    body.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.3)');
    window.addEventListener("focus", function() {
        closeModal(modal);
    }, false);
}

//function notify user
function notify_user(message="", color="") {  
    var notif = document.getElementById('notif');
    notif.firstElementChild.firstElementChild.innerHTML = "";
    notif.setAttribute('style', 'display: null;');
    if(color === "success") notif.setAttribute('style', 'background-color: green;');
    if(color === "danger") notif.setAttribute('style', 'background-color: red;');
    if(color === "warning") notif.setAttribute('style', 'background-color: yellow;');
    stuffElement(notif.firstElementChild.firstElementChild, message);  
}

//LOCAL STORAGE FUNCTIONS
//function get the content of localstorage
var getStorageContent = function () {
    let res = JSON.parse(localStorage.getItem('tableau'));
    if(res !== null) return res;
    else return [];
};

//function to set the local storage's content
function setLocalStorageContent (tableau) {
    localStorage.setItem("tableau", JSON.stringify(tableau));
}

//function to set the tasks's categories
var setStorageContentCat = function (categories) {
    localStorage.setItem("categories", JSON.stringify(categories));
};

//function to get the tasks's categories
var getStorageContentCat = function () {
    let res = JSON.parse(localStorage.getItem('categories'));
    if(res !== null) return res;
    else return [];
};

//function to set the tasks
var setStorageContentTask = function (tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//function to get the tasks
var getStorageContentTask = function () {    
    let res = JSON.parse(localStorage.getItem('tasks'));
    if(res !== null) return res;
    else return []; 
};

//MANAGE CATEGORIES
btn_open_modal_cat.addEventListener('click', function() {
    createModal(category_modal);
}, false);

btn_close_modal_cat.addEventListener('click', function(){
    closeModal(category_modal);
});

btn_reset_cat.addEventListener("click", function(){
    closeModal(category_modal);
});

//SET THE CATEGORIES IN THE MAIN ARRAY
var setMainArray = function (categories) {
    var tableau = {};
    LocalStorageToArray("CATEGORIES");
    LocalStorageToArray("USER");    
    if(USER.length !== 0){
        let user = getStorageUserConnected();
        tableau.user = user;
        tableau.categories = categories;
        
    }
    return tableau;
};

var addMainArray = function (tableau) {
    LocalStorageToArray("TABLEAU");  
    //Si le tableau envoyé n'est pas vide      
    if(Object.keys(tableau).length !== 0){
        //Si le tableau principal TABLEAU n'est pas vide (S'il est vide pas beson de verification on ajoute directement une ligne avec le user et les categories)
        //On regarde s'il contient des éléments
        //Si oui on recherche l'user connécté
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
var createCategory = function(name, color, icone) {
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
var addCategory = function (category) {
    if(category === false){
        notify_user("Echec d'ajout de la catégorie", "danger");
    }else{
        LocalStorageToArray("CATEGORIES");
        CATEGORIES.push(category);
        setStorageContentCat(CATEGORIES);
        addMainArray(setMainArray(CATEGORIES));
        displayCats(getCatByUser(USER));
        notify_user("Catégorie créer avec succès", "success");               
    } 
};

//function to get user entries for category form
md_btn_add_cat.addEventListener('click', function () {    
    addCategory(createCategory(cat_name.value, cat_color.value, cat_icone.value));  
    closeModal(category_modal);   
}, false);


///MANAGE TASKS

btn_open_main_modal.addEventListener("click", function() {
    createModal(main_modal);
    LocalStorageToArray("CATEGORIES");
    stuffCatsInSelect(CATEGORIES, select_cat_modal);
}, false);

btn_close_main_modal.addEventListener("click", function (){
    closeModal(main_modal);
}, false);

md_btn_reset_task.addEventListener("click", function() {
    closeModal(main_modal);
}, false);

//function create task
var createTask = function (name, desc="", done="false", cat) {
    var task = {};
    LocalStorageToArray("CATEGORIES"); LocalStorageToArray("TABLEAU");
    if(name !== undefined && desc !== undefined && cat !== undefined){ 
        let u = getStorageUserConnected();       
        task.name = name;
        task.desc = desc;
        task.done = done;
        CATEGORIES.forEach(item=>{
            if(item.name === cat){                
                item.tasks.push(task);
            }
        });
        TABLEAU.forEach(item1=>{
            
            if(item1.user.username === u.username){   
                console.log(item1.categories);             
                item1.categories = CATEGORIES;
            }
        });         
        setStorageContentCat(CATEGORIES);
        setLocalStorageContent(TABLEAU);    
        return task; 
    }else{
        return false;
    }   
};

//function add task
var addTask = function (task) {
    if(task === false){
        notify_user("Echec d'ajout de la tâche", "danger");
    }else{
        LocalStorageToArray("TASKS");
        if(Object.keys(task).length !== 0) TASKS.push(task);
        setStorageContentTask(TASKS);
        displayTaks(CATEGORIES);
        displayCats(CATEGORIES);
        notify_user("Tâche ajoutée avec succès", "success");
    } 
};

md_btn_add_task.addEventListener('click', function () {     
    addTask(createTask(task_name.value, task_desc.value, false, task_category.value));  
    closeModal(main_modal);  
});





///////MANAGE USERS CONNEXION
username = document.getElementById('username');
email = document.getElementById('email');
pass = document.getElementById('password');

//Storage's functions for user
var setStorageContentUser = function (users) {
    localStorage.setItem("users", JSON.stringify(users));
};

var getStorageContentUser = function () {
    let res = JSON.parse(localStorage.getItem('users'));
    if(res !== null) return res;
    else return []; 
};

var setStorageUserConnected = function (user) {
    localStorage.setItem("connected_user", JSON.stringify(user));
}

var getStorageUserConnected  = function () {
    let res = JSON.parse(localStorage.getItem('connected_user'));
    if(res !== null) return res;
    else return []; 
};
//function sign_in
var signin = function (username, email, pass) {
    var user = {}, login="", mail = "";
    let user_exist = false;
    if(username !== undefined && email !== undefined && pass !== undefined){
        LocalStorageToArray("USERS");
        USERS.forEach(item =>{ 
            login = item.username;
            mail = item.email;
            if(login === username || mail === email){
                user_exist = true;
                user = false;                  
            }
        });
        if(user_exist === false){
            user.username = username;
            user.email = email;
            user.pass = pass;
        }
        return user;
    }else{
        return false;
    }
};

//function add user to USERS
var addUser = function (user) {
    if(Object.keys(user).length !== 0 && user !== false ){
        USERS.push(user);
        setStorageContentUser(USERS);
        notify_user("Inscription réussie!!!", "success");
    }else{
        notify_user("Un utilisateur avec ces identifiants existe déjà.Si votre email est correct veiller choisr un autre nom d'utilisateur", "danger");
    }
    
};

//function login
var login = function (username, pass) {    
    if(username !== undefined && pass !== undefined){
        let log = false;
        USERS = getStorageContentUser();
        USERS.forEach(item =>{            
            if(item.username === username && item.pass === pass){
                log = true;
                setStorageUserConnected(item);
            }
        });
        if(log === true){
            LocalStorageToArray("TABLEAU");
            LocalStorageToArray("CATEGORIES");
            LocalStorageToArray("TASKS");
            return getStorageUserConnected();
        }else{
            notify_user("Il n'esiste aucun user avec ces identifiants! Vérifier puis réessayer!", "danger");
            return null;
        }        
    }else{
        notify_user("Veuiller renseigner un nom d'utilisateur et un mot de passe", "danger");
        return null;
    }   
}

var btn_signin = document.getElementById('signin');
btn_signin.addEventListener('click', function () {
    addUser(signin(username.value, email.value, pass.value));
}, false);

var btn_login = document.getElementById("btn-login");
var connexion_div = document.getElementById("connexion");
var inscription_div = document.getElementById("inscription");
btn_login.addEventListener('click', function () {
    var log = document.getElementById("login");
    var pass = document.getElementById("pass");
    var user = login(log.value, pass.value);
    if(user !== null){
        main_div.setAttribute("style", "display: null;");
        connexion_div.setAttribute("style", "display: none;");
        inscription_div.setAttribute("style", "display: none;");  
        notify_user("Ravi de vous revoir!", "success");
    }
});

var btn_logout = document.getElementById('logout');
var btn_profil = document.getElementById('profil');

//Fontion logout (consiste à liberer le localstorage contenant les infos du user qui était connecté)
var logout = function () {
    if(confirm("Voulez-vous vous déconnecter?")) {
        setStorageUserConnected(null);
        closeModal(modal_profil);
        closeModal(main_div);
        connexion_div.setAttribute("style", "display: null;");
        closeModal(inscription_div);
    }
}

//Au clic on verifie si la modal était ouvert on la ferme et inversement
btn_profil.addEventListener('click', function () {    
    if(modal_profil.style.display === "none"){        
        createModal(modal_profil);  
    }else {
        closeModal(modal_profil);
    }     
});

btn_logout.addEventListener("click", function () {
    logout();  
});

document.getElementById("btn-sign").addEventListener("click", function () {
    main_div.setAttribute("style", "display: none;");
    connexion_div.setAttribute("style", "display: none;");
    inscription_div.setAttribute("style", "display: null;"); 
});


var edit_password = function(user){
    let edit = false;
    let old_pass = document.getElementById("old-pass").value;
    let new_pass = document.getElementById("new-pass").value;
    let confirm_pass = document.getElementById("confirm-pass").value;    
    USERS.forEach((item) => {
        if(item.username === user.username){
            if(item.pass === old_pass){
                if(new_pass === confirm_pass){
                    user.pass = new_pass;
                    item.pass = new_pass;                
                    edit = true;
                }
            }
        }
    });

    if(edit === true){
        setStorageContentUser(USERS);
        setStorageUserConnected(user);
        notify_user("Modification du mot de passe réussie!!!", "success");       
    }else notify_user("Echec de la modification du mot de passe!!!", "danger");
}

var btn_edit_pass = document.getElementById("edit_pass");

var modal_edit_pass = document.getElementById("edit-pass-modal");

btn_edit_pass.addEventListener("click", function(){
    closeModal(modal_profil);
    createModal(modal_edit_pass);
    LocalStorageToArray(USER);
});

var btn_validate_edit_pass = document.getElementById("editer-pass");
btn_validate_edit_pass.addEventListener("click", function(){
    LocalStorageToArray("USER");
    LocalStorageToArray("USERS");
    edit_password(USER);
    closeModal(modal_edit_pass);
    createModal(modal_profil);
});



//FONCTION D'AFFICHAGES DES DIFFERENTES INTERFACES

//function to create an HTMLelement
var createElement = function (elmt) {    
    return document.createElement(elmt);;
};

//function to stuff an element
var stuffElement = function (e, content) {    
    return e.appendChild(document.createTextNode(content));
};

//function to get categories by logged user
var getCatByUser = function (user) {
    LocalStorageToArray("TABLEAU");    
    var cats = [];
    TABLEAU.forEach(item =>{
        if(item.user.username === user.username){
            cats = item.categories;
        }
    });
    return cats;
};


//FUNCTION TO LIST TASKS BY CAT
var listTaskByCat = function(e){    
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


//FUNCTION TO LIST TASKS FOR MENU-BLOC

var listTasksByMenu = function(e){
    let menu = e.target.getAttribute('href');
    menu = menu.split("#")[1];
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
var menu_bloc = document.getElementById('menu-bloc');
var all_li_menu_bloc = menu_bloc.getElementsByClassName("li_menu");
for(let item of all_li_menu_bloc){
    item.addEventListener('click', function (e) {                
        listTasksByMenu(e);
    });
}

////////////////////////////////////BADGE DE NBRE DE TACHE ACCOMPLIES////////////////////////////////////////////
var get_badge = function(cat) {
    let total = cat.tasks.length;
    let done = 0;
    cat.tasks.forEach((item) =>{
        if(item.done === true){
            done = done + 1;
        }
    });
    return done+" / "+total;
};

var sidebar_cats = document.getElementById("list-cat");

//function to display categories of user in the sidebar
function displayCats(cats) {
    let li, a, i, i_delete, i_edit, badge;
    sidebar_cats.innerHTML = "";
    cats.forEach(item =>{
        li = createElement('li');
        li.className = "li-cat";
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
            delete_category(e.target);
        });

        i_edit.addEventListener("click", function (e) {
            showEditZone(createEditZoneForCat(getSelectedCat(e.target), e.target.parentNode.parentNode), e.target.parentNode.parentNode);
            e.target.parentNode.parentNode.setAttribute("style", "display:none;");
            e.target.parentNode.setAttribute("style", "display: none;");
        });

        li.addEventListener("click", function(e){
            listTaskByCat(e);
        });
        sidebar_cats.appendChild(li);   
    });
}


function createDivTask(div, hr, p1, input, span, p2, i1, i2, i3, i, item) {
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
    }); 
    span = createElement("span");
    span.className = "right-bloc";
    i1 = createElement("i");
    i1.className = "fa fa-edit";
    i1.addEventListener("click", function(e){
        showEditZone(createEditZone(getSelectedTask(e.target), e.target), e.target.parentNode.parentNode);
        e.target.parentNode.parentNode.setAttribute("style", "display:none;");
        e.target.parentNode.parentNode.nextElementSibling.setAttribute('style', "display:none");
    });      
    i2 = createElement("i");
    i2.className = 'fa fa-trash';
    i2.addEventListener('click', function(e){
        delete_task(e);
    });           
    i3 = createElement("i");
    i3.className = "fa fa-flag";
    i4 = createElement("i");
    stuffElement(i4, item.name); 
    i4.addEventListener("dblclick", function(e){
        console.log(e.target.parentNode);
        showEditZone(createEditZoneForTaskCat(getSelectedCat(e.target), e.target.parentNode), e.target.parentNode);
        e.target.parentNode.setAttribute("style", "display:none;");
        e.target.setAttribute("style", "display: none;");
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


function displayTaks(cats, cat_name = ""){
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

function displayDoneTasks(cats, cat_name="") {
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
            if(i.done === true){
                createDivTask(div, hr, p1, input, span, p2, i1, i2, i3, i, item);
            }     
        });
    });
}

function stuffCatsInSelect(cats, select) {
    let option;
    //let select = document.getElementById("md-task-category");
    select.innerHTML = "";
    cats.forEach(item =>{
        option = createElement('option');
        option.setAttribute('value', item.name);
        stuffElement(option, item.name);
        select.appendChild(option);
    });
}

function displayCatSelectedWhenCreateTask(cat) {
    let span = document.getElementById("band");  
    span.innerHTML = "";  
    stuffElement(span, cat);
    span.className = "banderolle";    
}

var selectCat = document.getElementById("md-task-category");
selectCat.addEventListener("change", function () {
   displayCatSelectedWhenCreateTask(selectCat.options[selectCat.selectedIndex].value);
});

function displayInput() {
    let input = document.getElementById('new_cat');
    input.removeAttribute('hidden');
    let btn = document.getElementById('add_new');
    btn.removeAttribute('hidden');
}

function hideInput() {
    let input = document.getElementById('new_cat');
    input.setAttribute('hidden', "true");
    let btn = document.getElementById('add_new');
    btn.setAttribute('hidden', "true");
}


var newCat = document.getElementById("new");
newCat.addEventListener("click", function () {
   displayInput(); 
});
var btn_new = document.getElementById("add_new");
btn_new.addEventListener('click', function () {
    let input = document.getElementById('new_cat');
    task_category.value = input.value;
    task_category.selectedIndex = input;
    console.log(task_category.options); 
    addCategory(createCategory(input.value));
    stuffCatsInSelect(getCatByUser(USER), select_cat_modal);
    hideInput();
    displayCats(getCatByUser(USER));
    stuffCatsInSelect(getCatByUser(USER), select_cat_modal);
    displayCatSelectedWhenCreateTask(input.value);
});






//function to set the storage content in arrays
//Appeler pour pré-remplir le  tabeau passé en paramètre avec le contenu du localStorage
function LocalStorageToArray(t) {
    if(t === "TABLEAU") TABLEAU = getStorageContent();
    if(t === "CATEGORIES") CATEGORIES = getStorageContentCat();
    if(t === "TASKS") TASKS = getStorageContentTask();
    if(t === "USERS") USERS = getStorageContentUser();
    if(t === "USER") USER = getStorageUserConnected();
}

//Function principal
(function () {
    let user_signed = getStorageUserConnected();
    if(Object.keys(user_signed).length !== 0){
        LocalStorageToArray(USER);
        main_div.setAttribute("style", "display: null;");
        connexion_div.setAttribute("style", "display: none;");
        inscription_div.setAttribute("style", "display: none;");          
        displayCats(getCatByUser(user_signed));
        displayTaks(getCatByUser(user_signed));
        stuffCatsInSelect(getCatByUser(user_signed), select_cat_modal);
        stuffElement(document.getElementById('signed_user'), user_signed.username);
    }    
})();



//FUNCTIONS TO EDIT TASKS
var btn_edit_all = bloc_task.getElementsByClassName("fa-edit");

//function to get the selected task
var getSelectedTask = function (item) {
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
                    console.log(task_name);
                    if(i.name === task_name) task = i;
                });
            });
        }
    });
    return task;
};

//function to create edit zone
var createEditZone = function (task, item) {
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
    });
    let btn_reset = createElement('input');
    btn_reset.type = "button";
    btn_reset.value = "Annuler";
    btn_reset.addEventListener('click', function(e) {
        reset_edit(item, e);
    });
    p.appendChild(input);
    div.appendChild(p);
    div.appendChild(btn_add);
    div.appendChild(btn_reset);    
    return div;
};

//function to hide task zone and show edit zone
function showEditZone(edit_zone, zone_to_hide) {
    zone_to_hide.parentNode.appendChild(edit_zone);
}


//function to validate edit
var validate_edit = function (e, task_to_edit) {
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




///////EDIT CATEGORY

var getSelectedCat = function(item){ 
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

function edit_category(e, cat_to_edit){
    let cat_name = e.target.parentNode.firstElementChild.value;
    let cat_icone = e.target.parentNode.firstElementChild.nextElementSibling.nextSibling.value;
    let cat_color = e.target.parentNode.firstElementChild.nextSibling.value;
    console.log("ici", cat_to_edit);
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

function hide_zone(zone_to_hide, zone_to_show){
    zone_to_hide.setAttribute("style", "display: none;");
    zone_to_show.removeAttribute("style");
}

var getSelectedItem = function(e){
    let select = e.target.parentNode.firstElementChild;
    let selectedItem = select.options[select.selectedIndex].value;
    return selectedItem;
}

var getTaskOfTheCat = function(e){
    let task_name = e.target.parentNode.parentNode.firstElementChild.nextElementSibling.firstElementChild.nextSibling.textContent;
    return task_name;
}

var delete_task_to_the_old_cat = function(cat_to_edit, task_name){
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
    console.log(cat_to_edit.name, selectedItem);
    if(cat_to_edit.name !== selectedItem){
        //On recupère la tâche en question
        task = delete_task_to_the_old_cat(cat_to_edit, getTaskOfTheCat(e));        
        console.log(task);
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

var createEditZoneForTaskCat = function(cat, zone_to_hide){
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

var createEditZoneForCat = function(cat, zone_to_hide){
    console.log(zone_to_hide);
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

var bloc_cat = document.getElementById("first");
var btn_edit_all_cat = bloc_cat.getElementsByClassName("fa-pen");


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

var btn_delete_all_cat = bloc_cat.getElementsByClassName("fa-trash");



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




/*_________________________________________MODAL DE NOTIFICATION______________________________________________*/
var btnNotif = document.getElementById('close-notif');
var notif = document.getElementById('notif');
btnNotif.addEventListener('click', function(){
    notif.setAttribute('style', 'display: none;');
});
/*_________________________________________/MODAL DE NOTIFICATION______________________________________________*/

