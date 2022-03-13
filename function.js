
/* 
   Fungsi toast untuk memunculkan message
   how to use: toast("Haloo")  
*/

function toast(msg) {
   var x = document.getElementById("snackbar");
   let message = msg;

   x.innerHTML = message
   x.className = "show";
   setTimeout(function () { x.className = x.className.replace("show", ""), x.attr; }, 3000);
}
