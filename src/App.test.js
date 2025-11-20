import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Si esto corre sin errores rojos, la prueba pasa.
});
