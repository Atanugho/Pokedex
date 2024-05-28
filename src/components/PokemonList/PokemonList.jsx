import { useEffect, useState } from "react"
import axios from 'axios';
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    // const [pokemonList, setPokemonList] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    // const [pokedexUrl,setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

    // const [nextUrl,setNextUrl] = useState('');
    // const [prevUrl,setPrevUrl] = useState('');

    const [pokemonListstate,setPokemonListState] = useState({
        pokemonList: [],
        isLoading :true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        prevUrl: '',
    });

    async function downloadPokemon(){
        // isLoading(true);

        setPokemonListState((state) => ({...state, isLoading:true}));

        const response = await axios.get(pokemonListstate.pokedexUrl);

        const pokemonResult  = response.data.results; //we get the array of pokemon from result
        console.log(response.data)

        setPokemonListState((state) => ({
            ...state, 
            nextUrl :response.data.next, 
            prevUrl :response.data.previous
        }));
        

        //iterating over the array of pokemons , and using their url to create an array of promises
        //that will download those 20 pokemon
        const pokemonResultPromise = pokemonResult.map((pokemon) => axios.get(pokemon.url))

        //passing that promise array to axios.all
        const pokemonData  = await axios.all(pokemonResultPromise);
        console.log(pokemonData);

        const res = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id:pokemon.id,
                name: pokemon.name, 
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }
        });
        console.log(res);
        setPokemonListState((state) => ({
            ...state,
            pokemonList: res, 
            isLoading: false
        }));
    }

    useEffect(() => {
        downloadPokemon();
    }, [pokemonListstate.pokedexUrl]);

    
    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(pokemonListstate.isLoading)? 'Loading...':
                    pokemonListstate.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
                }
            </div>
            <div className="controls">
                <button disabled={pokemonListstate.prevUrl == null} onClick={() => {
                    const urlToSet = pokemonListstate.prevUrl;
                    setPokemonListState({...pokemonListstate,pokedexUrl: urlToSet})
                }}>Prev</button>
                     
                <button disabled={pokemonListstate.nextUrl == null} onClick={() => {
                    const urlToSet = pokemonListstate.nextUrl;
                    setPokemonListState({...pokemonListstate, pokedexUrl: urlToSet})
                }}>Next</button>

            </div>
        </div>
    )
}

export default PokemonList