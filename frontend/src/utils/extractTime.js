export function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}`;
}

function padZero(number) {
	return number.toString().padStart(2, '0')
}