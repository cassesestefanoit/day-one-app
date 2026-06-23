/**
 * Calcula todos los días de un mes específico para el scroll horizontal.
 * @param {Date} date - Fecha que representa el mes actual.
 * @returns {Date[]} Array de objetos Date con cada día del mes.
 */
export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); 
  // El día '0' del mes siguiente nos da el último día del mes actual.
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
};

/**
 * Calcula el nuevo mes sumando o restando un offset.
 * @param {Date} currentMonth - El mes actual en el estado.
 * @param {number} offset - El cambio (1 para mes siguiente, -1 para anterior).
 * @returns {Date} Nuevo objeto Date con el mes modificado.
 */
export const calculateNewMonth = (currentMonth, offset) => {
  const newMonth = new Date(currentMonth.getTime());
  newMonth.setMonth(newMonth.getMonth() + offset);
  return newMonth;
};