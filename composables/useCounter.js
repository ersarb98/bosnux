export const useCounter = () => {
  const counter = useState('counter', () => 0);

  const increment = () => {
    counter.value++;
  };

  const decrement = () => {
    counter.value--;
  };

  return {
    counter,
    increment,
    decrement,
  };
};