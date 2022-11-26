/**
 * Функция ошибки получения ссылки на файл из хранилища
 * @param error Объект ошибки
 * @returns {string}
 */
export const storageErrors = (error) => {
    switch (error.code) {
        case 'storage/object-not-found':
            // File doesn't exist
            break;
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;

        // ...

        case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        default:
            return ""
    }
}
/**
 * Функция проверки на пустоту значения в переданном объекте
 * @param obj Объект
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false;
    }
    return true;
}