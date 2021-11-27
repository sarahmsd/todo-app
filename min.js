/**************************************** MODAL D'AJOUT D'UNE TÂCHE ****************************************/

var modal = document.getElementById("task-modal");
var btnOpenModal = document.getElementById("add-task-plus");
var body = document.body;
btnOpenModal.addEventListener("click", function(){    
    modal.removeAttribute("style");
    body.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.3)');    
});

var btnCloseModal = document.getElementById('closeModal');

btnCloseModal.addEventListener('click', function(){
    modal.setAttribute("style", "display : none");
    body.removeAttribute('style');
});

///modal de categorie
var modalCat = document.getElementById("category-modal");
var btnOpenModalCat = document.getElementById("add-cat-plus");
btnOpenModalCat.addEventListener("click", function () {
   modalCat.removeAttribute("style");
   body.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.3)');
});

/*body.addEventListener("click", function (e) {
    console.log(modal.getAttribute('style'));
    if(modal.getAttribute('style') == null){        
        modal.setAttribute("style", "display : none");
    }    
});*/
/*________________________________________/MODAL D'AJOUT D'UNE TÂCHE_________________________________________*/
