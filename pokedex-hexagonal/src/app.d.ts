// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Locals {}
        // interface Error {}
        // interface Platform {}
        interface PageData {
            pokemon?: {
                id: number;
                name: string;
                types: string[];
                abilities: { name: string; isHidden: boolean }[];
                stats: {
                    hp: number;
                    attack: number;
                    defense: number;
                    specialAttack: number;
                    specialDefense: number;
                    speed: number;
                };
                height: number;
                weight: number;
            };
            error?: {
                message: string;
                code: string;
            };
        }
    }
}

export { };
