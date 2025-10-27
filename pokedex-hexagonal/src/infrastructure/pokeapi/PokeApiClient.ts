import axios from "axios";
import { POKEAPI_BASE_URL } from '$config';

export class PokeApiClient {
    async getPokemonById(id: number): Promise<any> {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        return response.data;
    }

    async getPokemonByName(name: string): Promise<any> {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${name}`);
        return response.data;
    }
}
