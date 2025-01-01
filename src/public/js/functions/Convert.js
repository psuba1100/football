export function convertToMinutes(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60); // Get the minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds

    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Format as MM:SS
}