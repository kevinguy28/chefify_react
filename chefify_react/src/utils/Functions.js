export function capitalize(str){
    if(str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function clearForms(){
    Array.from(document.forms).forEach(form => form.reset());
}