//Globals variables
export var CATEGORIES = [];//Cette variable accueil les catégories d'un user spécifique
export var TABLEAU = [];// CETTE VARIABLE CONTIENT TOUTES LES CATEGORIES ET TÂCHES CLASSES PAR USER
export var TASKS = [];//CETTE VARIABLE CONTIENT TOUTES LES TÄCHES D4UN USER
export var USERS = [];//CETTE VARIABLE CONTIENT TOUS LES UTILISATEURS INSCRITS
export var USER = [];//CETTE VARIABLE CONTIENT LES INFOS DE L'USER CONNECTE
export var PRIORITES = [];//CONTIENT LES DIFFERENTES PRIORITES EXISTANTES
//function get the content of localstorage
export function getStorageContent() {
    let res = JSON.parse(localStorage.getItem('tableau'));
    if(res !== null) return res;
    else return [];
};

//function to set the local storage's content
export function setLocalStorageContent (tableau) {
    localStorage.setItem("tableau", JSON.stringify(tableau));
}

//function to set the tasks
export function setStorageContentTask(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//function to get the tasks
export function getStorageContentTask() {    
    let res = JSON.parse(localStorage.getItem('tasks'));
    if(res !== null) return res;
    else return []; 
};

//function to set the tasks's categories
export function setStorageContentCat(categories) {
    localStorage.setItem("categories", JSON.stringify(categories));
};

//function to get the tasks's categories
export function getStorageContentCat() {
    let res = JSON.parse(localStorage.getItem('categories'));
    if(res !== null) return res;
    else return [];
};

//Storage's functions for user
export function setStorageContentUser(users) {
    localStorage.setItem("users", JSON.stringify(users));
};

export function getStorageContentUser() {
    let res = JSON.parse(localStorage.getItem('users'));
    if(res !== null) return res;
    else return []; 
};

export function setStorageUserConnected(user) {
    localStorage.setItem("connected_user", JSON.stringify(user));
}

export function getStorageUserConnected() {
    let res = JSON.parse(localStorage.getItem('connected_user'));
    if(res !== null) return res;
    else return []; 
};

//Storage's functions for priority
export function setStorageContentPriority(priorities) {
    localStorage.setItem("priorities", JSON.stringify(priorities));
};

export function getStorageContentPriority() {
    let res = JSON.parse(localStorage.getItem('priorities'));
    if(res !== null) return res;
    else return []; 
};

export function LocalStorageToArray(t) {
    if(t === "TABLEAU") TABLEAU = getStorageContent();
    if(t === "CATEGORIES") CATEGORIES = getStorageContentCat();
    if(t === "TASKS") TASKS = getStorageContentTask();
    if(t === "USERS") USERS = getStorageContentUser();
    if(t === "USER") USER = getStorageUserConnected();
    if(t === "PRIORITES") PRIORITES = getStorageContentPriority();
}

