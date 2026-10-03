import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DetallePokemon from "./DetallePokemon";
import { Image } from "react-native";

export default function Home() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);
    const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);

    const [reload, setReload] = useState(false);

    const [name, setName] = useState("");

    const fetchPokemon = useCallback(async () => {
        setloading(true);
        setError(null);
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20")
            .then(res => setPokemon(res.data.results))
            .catch(() => setError("Error al cargar los datos :'v"))
            .finally(() => setloading(false));
    }, []);

    //Muestra la lista automáticamente al abrir la página
    useEffect(() => {
        fetchPokemon();
    }, []);

    const recargar = useCallback( async() => {
        setReload(true); //empieza a recargar los datos
        await fetchPokemon();
        setReload(false); //terminó de recargar
    }, [fetchPokemon]);

    const buscarPokemon = useCallback(async (name) => {
        if(name.trim() === ""){
            setError("Por favor ingresa un nombre para buscar");
            return;
        }
        setloading(true);
        setError(null);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`)
            .then(res => setPokemon([res.data])) //devuelve una lista de arrays
            .catch(() => setError("Este Pokémon no existe :'v"))
            .finally(() => setloading(false));
        setName(""); //limpia el input luego de buscar
    }, []);

    const seleccionarPokemon = useCallback(async (item) => {
        setloading(true);
        setError(null);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
            .then(res => setPokemonSeleccionado(res.data))
            .catch(() => setError("No se pudieron cargar los detalles del Pokémon :'v"))
            .finally(() => setloading(false));
    }, []);

    if(pokemonSeleccionado){
        return (
            <DetallePokemon
                pokemon={pokemonSeleccionado}
                onVolver={() => setPokemonSeleccionado(null)}
            />
        );
    }

    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Pokémon <Image style={styles.imgPokeball} source={require("../../assets/pokeball.png")}></Image></Text>
            <Text>Todos los Pokémon disponibles 🎉</Text>

            <TextInput
            style={styles.inputBuscar}
            value={name}
            onChangeText={setName}
            placeholder="Buscar Pokémon..."
            ></TextInput>

            <TouchableOpacity onPress={() => buscarPokemon(name)}
            style={styles.buscar}>
                <Text style={{fontWeight: "bold", color: "white"}}>Buscar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reload} onPress={recargar}>
                <Text style={{fontWeight: "bold", color: "white"}}>
                    {reload ? "Recargando..." : "Recargar lista"}
                </Text>
            </TouchableOpacity>

            {error && <Text style={{color: "red", marginBottom: 10}}>{error}</Text>}
            {loading ? (
                <Text>Cargando lista, espera...</Text>
            ) : (
                <FlatList
                    data={pokemon}
                    numColumns={2} //2 cards por fila
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        //TouchableOpacity funciona como tarjeta y botón a la vez
                        <TouchableOpacity
                            style={styles.card_pokemon}
                            onPress={() => seleccionarPokemon(item)}
                        >
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.url}>{item.url}</Text>
                        </TouchableOpacity>
                    )}
                ></FlatList>
            )}
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    card_pokemon: {
        flex: 1,
        margin: 5, //para que las tarjetas no estén tan juntas
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    titulo: {
        fontSize: 24,
        textAlign: "center",
        fontFamily: "Arial",
        fontWeight: "bold",
        marginBottom: 20
    },
    
    name: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        fontSize: 20
    },

    url: {
        flexShrink: 1 //para que la url no se salga de la tarjeta
    },

    reload: {
        borderWidth: 1,
        backgroundColor: "black",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20
    },

    inputBuscar: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 8
    },

    buscar: {
        borderWidth: 1,
        backgroundColor: "#2a2a72",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20
    },

    imgPokeball: {
        width: 30,
        height: 30,
    }
})