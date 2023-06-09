(function() {  
    let currentDate = new Date();

    let dateString = currentDate.getDate() + "/" 
        + String(currentDate.getMonth() + 1).padStart(2, '0') + "/" 
        + String(currentDate.getFullYear()).padStart(2, '0');

    document.getElementById('date').textContent = dateString;

})();  
