import { main_div} from "./main.js";
import { LocalStorageToArray, setStorageContentUser, setStorageUserConnected, USERS, USER } from "./storagemodule.js";
import { notify_user, closeModal, createModal } from "./commons.js";

export let modal_profil = document.getElementById("profil_modal");


export let username = document.getElementById('username');
export let email = document.getElementById('email');
export let pass = document.getElementById('password');
export let connexion_div = document.getElementById("connexion");
export let inscription_div = document.getElementById("inscription");


//function sign_in
function signin (username, email, pass) {
    let user = {}, login="", mail = "";
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
            setStorageUserConnected(user);
        }
        return user;
    }else{
        return false;
    }
};

//function add user to USERS
function addUser(user) {
    if(Object.keys(user).length !== 0 && user !== false ){
        USERS.push(user);
        setStorageContentUser(USERS);
        notify_user("Inscription réussie!!!", "success");
    }else{
        notify_user("Un utilisateur avec ces identifiants existe déjà.Si votre email est correct veiller choisr un autre nom d'utilisateur", "danger");
    }
    
};

//function login
function login(username, pass) {    
    if(username !== undefined && pass !== undefined){
        let log = false;
        LocalStorageToArray("USERS");
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
            LocalStorageToArray("USER");
            return USER;
        }else{
            notify_user("Il n'esiste aucun user avec ces identifiants! Vérifier puis réessayer!", "danger");
            return null;
        }        
    }else{
        notify_user("Veuiller renseigner un nom d'utilisateur et un mot de passe", "danger");
        return null;
    }   
}

//Fontion logout (consiste à liberer le localstorage contenant les infos du user qui était connecté)
function logout() {
    if(confirm("Voulez-vous vous déconnecter?")) {
        setStorageUserConnected(null);
        closeModal(modal_profil);
        closeModal(main_div);
        connexion_div.setAttribute("style", "display: null;");
        closeModal(inscription_div);
    }
}

function edit_password(user){
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


let btn_signin = document.getElementById('signin');
btn_signin.addEventListener('click', function () {
    addUser(signin(username.value, email.value, pass.value));
    let user = login(username.value, pass.value);
    if(user !== null){
        main_div.setAttribute("style", "display: null;");
        connexion_div.setAttribute("style", "display: none;");
        inscription_div.setAttribute("style", "display: none;");  
        notify_user('Ravi de vous revoir! ' + USER.username, "success");
    }
}, false);

let btn_login = document.getElementById("btn-login");
btn_login.addEventListener('click', function () {
    let log = document.getElementById("login");
    let pass = document.getElementById("pass");
    let user = login(log.value, pass.value);
    if(user !== null){
        main_div.setAttribute("style", "display: null;");
        connexion_div.setAttribute("style", "display: none;");
        inscription_div.setAttribute("style", "display: none;");  
        notify_user('Ravi de vous revoir! ${USER.username}', "success");
    }
});

let btn_logout = document.getElementById('logout');
let btn_profil = document.getElementById('profil');

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
    inscription_div.removeAttribute("style"); 
});

document.getElementById("connect").addEventListener("click", function () {
    main_div.setAttribute("style", "display: none;");
    connexion_div.setAttribute("style", "display: null;");
    inscription_div.setAttribute("style", "display: none;"); 
});


let btn_edit_pass = document.getElementById("edit_pass");

let modal_edit_pass = document.getElementById("edit-pass-modal");

btn_edit_pass.addEventListener("click", function(){
    closeModal(modal_profil);
    createModal(modal_edit_pass);
    LocalStorageToArray(USER);
});

let btn_validate_edit_pass = document.getElementById("editer-pass");
btn_validate_edit_pass.addEventListener("click", function(){
    LocalStorageToArray("USER");
    LocalStorageToArray("USERS");
    edit_password(USER);
    closeModal(modal_edit_pass);
    createModal(modal_profil);
});
