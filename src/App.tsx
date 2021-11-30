import {
  Component,
  createSignal,
  onMount,
  For,
  Show,
} from "solid-js";
import { createMutable } from "solid-js/store";

import styles from "./App.module.css";

const fetchPokemon = async (id?: string) => {
  const idTonumber = Number(id)
  const max = 898;
  id = !isNaN(idTonumber) && idTonumber > max? max.toString() : id
  const urlParam = !!id? id : Math.floor(Math.random() * max)
  try {
    const resp = await fetch(
      ` https://pokeapi.co/api/v2/pokemon/${urlParam}`
    );
    return await resp.json();
  } catch (error) {
    alert(error)
    
  }
};


const App: Component = () => {
  const pokemonStore = createMutable({ pokemons: [] as any[] });
  const [selectedPokemon,setSelectedpokemon]= createSignal(-1)
  const [pokemonToSearch, setPokemonTosearch] = createSignal('')
  const addPokemon = async (id?:string) => {
    const pokemon = await fetchPokemon(id);

    if(!!pokemon)pokemonStore.pokemons = [...pokemonStore.pokemons,pokemon]
    setPokemonTosearch('')
  };
  const removePokemon = ()=>{
    if(selectedPokemon() >=0) {
      pokemonStore.pokemons[selectedPokemon()] = {...pokemonStore.pokemons[selectedPokemon()],hide:true}
      setSelectedpokemon(-1)
    }
  }
  
  onMount(addPokemon);
  return (
    <div className="m-3">
      <button className="button is-info is-light m-1" onClick={()=>addPokemon()}>
        random pokemon
      </button>
      <button className="button is-danger is-light m-1" onClick={removePokemon} disabled={selectedPokemon() < 0 }>
        remove
      </button>
      <input type="text" className='input m-1' value={pokemonToSearch()} oninput={e=>setPokemonTosearch(e.target.value)} />
      <button className='button is-success is-light m-1' onclick={()=>addPokemon(pokemonToSearch())} disabled={pokemonToSearch().trim().length === 0}>search</button>
      <div className={`columns is-desktop mt-1 ${styles.cards}`}>
        <For each={pokemonStore.pokemons} fallback={<div>loading...</div>}>
          {(p: any,index) => (
            <Show when={!p?.hide}>
              <div className="column is-one-quarter-desktop" onClick={()=>setSelectedpokemon(index())}>
              <div className={`card ${styles.card_animation}`} >
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src={p?.sprites.front_default}
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{p?.name}</p>
                      <p className="subtitle is-6">{p?.types[0].type.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
