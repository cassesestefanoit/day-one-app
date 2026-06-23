import { useTaskStore } from '../store/taskStore';


jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Pruebas en el Store Global (Zustand)', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  test('Debe inicializarse con un array de tareas vacío', () => {
    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
  });

  test('updateTask debe modificar una tarea existente en el estado', async () => {
    const tareaInicial = { id: '123', title: 'Tarea Vieja', priority: 'Baja' };
    useTaskStore.setState({ tasks: [tareaInicial] });

    const tareaModificada = { id: '123', title: 'Tarea Actualizada', priority: 'Alta' };
    await useTaskStore.getState().updateTask(tareaModificada);

    const tareasFinales = useTaskStore.getState().tasks;
    expect(tareasFinales).toHaveLength(1);
    expect(tareasFinales[0].title).toBe('Tarea Actualizada');
    expect(tareasFinales[0].priority).toBe('Alta');
  });
});