import { calculateNewMonth } from '../functions/calendarUtils';

describe('Pruebas en utilidades de calendario (calendarUtils)', () => {
  test('Debe avanzar un mes correctamente (+1)', () => {
    const fechaInicial = new Date(2026, 0, 1); // 1 de Enero de 2026
    const resultado = calculateNewMonth(fechaInicial, 1);
    
    expect(resultado.getMonth()).toBe(1); // Debe ser Febrero (mes 1 en JS)
    expect(resultado.getFullYear()).toBe(2026);
  });

  test('Debe retroceder un mes y cambiar de año correctamente (-1)', () => {
    const fechaInicial = new Date(2026, 0, 1); // 1 de Enero de 2026
    const resultado = calculateNewMonth(fechaInicial, -1);
    
    expect(resultado.getMonth()).toBe(11); // Debe ser Diciembre (mes 11)
    expect(resultado.getFullYear()).toBe(2025); // Año anterior
  });
});