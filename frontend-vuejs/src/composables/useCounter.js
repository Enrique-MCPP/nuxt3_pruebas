import { ref } from 'vue';

const useCounter = (initialValue = 10)=>{
    const counter = ref(initialValue);


    return {
      counter,
      increase:() => counter.value++,
      decrease: () => counter.value--,
      increaseBy: (value) => counter.value += value
    }

}

export default useCounter