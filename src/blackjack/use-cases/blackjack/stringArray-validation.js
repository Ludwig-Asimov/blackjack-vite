/**
 * Validates the param.
 * @param {String[]} data - The Array to validate
 * @returns {Error} Error if not valid array.
 */
export const isValid = (data) => {
    if (!Array.isArray(data))
        throw new Error("Not Array");
    if (data.length === 0)
        throw new Error("Array is empty");
    if (!data.every(item => typeof item === "string"))
        throw new Error("Not String Array");
}
