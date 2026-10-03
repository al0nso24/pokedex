import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DetallePokemon from "./DetallePokemon";
import { Image } from "react-native";

//Arreglo de generaciones para los botones
//offset = desde que número empieza cada generación
const generaciones = [
    { nombre: "G1", offset: 0, cantidad: 151 },
    { nombre: "G2", offset: 151, cantidad: 100 },
    { nombre: "G3", offset: 251, cantidad: 135 },
    { nombre: "G4", offset: 386, cantidad: 107 },
    { nombre: "G5", offset: 493, cantidad: 156 },
    { nombre: "G6", offset: 649, cantidad: 72 },
    { nombre: "G7", offset: 721, cantidad: 88 },
    { nombre: "G8", offset: 809, cantidad: 96 },
    { nombre: "G9", offset: 905, cantidad: 120 },
];

export default function Home() {
    const [pokemon, setPokemon] = useState([]); //lista de los pokémon
    const [loading, setloading] = useState(true); //si carga datos
    const [error, setError] = useState(null); //si hay error
    //Guarda el pokémon para ver su información
    const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);

    //Para recargar la página
    const [reload, setReload] = useState(false);

    //Nombre del pokémon para buscarlo
    const [name, setName] = useState("");

    //El número de generación
    const [generacion, setGeneracion] = useState(0) //0 = Gen 1

    const fetchPokemon = useCallback(async () => {
        //Empieza cargando
        setloading(true);
        //No muestra errores
        setError(null);
        //Toma la generación actual según el índice actual
        const gen = generaciones[generacion];
        //Devuelve la lista de pokémon con un rango específico
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${gen.cantidad}&offset=${gen.offset}`)
            //Obtiene los datos
            .then(res => setPokemon(res.data.results))
            //Por si falla al cargar los datos
            .catch(() => setError("Error al cargar los datos :'v"))
            //setloading(false) = ya no hay nada que cargar
            .finally(() => setloading(false));
    }, [generacion]); //en base a la generación, muestra los pokémon

    //Muestra la lista automáticamente al abrir la página
    //Cada vez que cambie la generación, también se ejecuta de nuevo
    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    //Esto es para recargar la página en caso no carguen los datos
    const recargar = useCallback( async() => {
        setReload(true); //empieza a recargar los datos
        await fetchPokemon(); //para que muestre la lista de nuevo
        setReload(false); //terminó de recargar
    }, [fetchPokemon]);

    //Buscar pokémon en base a su nombre
    const buscarPokemon = useCallback(async (name) => {
        //Si no se escribe nada
        if(name.trim() === ""){
            setError("Por favor ingresa un nombre para buscar");
            return; //termina
        }
        setloading(true); //empieza a cargar para mostrar el pokémon
        setError(null);
        //Busca el pokémon y convierte el nombre a minúscula para evitar errores
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.trim().toLowerCase()}`)
            .then(res => setPokemon([res.data])) //devuelve una lista de arrays
            .catch(() => setError("Este Pokémon no existe :'v")) //si no existe
            .finally(() => setloading(false));
        setName(""); //limpia el input luego de buscar
    }, []);

    //Muestra la información de cada pokémon individualmente
    //item = cada elemento de la lista
    const seleccionarPokemon = useCallback(async (item) => {
        setloading(true);
        setError(null);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
            .then(res => setPokemonSeleccionado(res.data))
            .catch(() => setError("No se pudieron cargar los detalles del Pokémon :'v"))
            .finally(() => setloading(false));
    }, []);

    //Si se seleccionó un pokémon no muestra lista entera, solo su información
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
            <Text style={{textAlign: "center"}}>Todos los Pokémon disponibles 🎉</Text>

            <View style={styles.generaciones}>
                {generaciones.map((gen, index) => (
                    <TouchableOpacity
                    key={index}
                    onPress={() => {
                        //Cambia generación
                        setGeneracion(index);
                        //Limpia el error
                        setError(null);
                    }}
                    //index es el num de generación en este caso
                    style={[styles.botonGen, index === generacion && styles.botonGenActivo]}
                    >
                        <Text style={{color: "white", fontWeight: "bold"}}>{gen.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
            style={styles.inputBuscar}
            value={name}
            onChangeText={setName}
            placeholder="Buscar Pokémon..."
            >
            </TextInput>

            {/*Buscar en base al nombre*/}
            <TouchableOpacity onPress={() => buscarPokemon(name)}
            style={styles.buscar}>
                <Text style={{fontWeight: "bold", color: "white"}}>Buscar</Text>
            </TouchableOpacity>

            {/*Botón para recargar*/}
            <TouchableOpacity style={styles.reload} onPress={recargar}>
                <Text style={{fontWeight: "bold", color: "white"}}>
                    {reload ? "Recargando..." : "Recargar lista"}
                </Text>
            </TouchableOpacity>

            {error && <Text style={{color: "red", marginBottom: 10}}>{error}</Text>}
            {loading ? (
                //Si loaging es true
                <Text>Cargando lista, espera...</Text>
            ) : (
                //Si ya cargó, muestra la lista
                <FlatList
                    data={pokemon}
                    //Cada pokémon tiene nombre único, por eso item.name.toString()
                    keyExtractor={(item) => item.name.toString()}
                    renderItem={({ item }) => (
                        //TouchableOpacity funciona como tarjeta y botón a la vez
                        <TouchableOpacity
                            style={styles.card_pokemon}
                            onPress={() => seleccionarPokemon(item)}
                        >
                            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
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
        padding: 7,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    titulo: {
        fontSize: 34,
        textAlign: "center",
        fontFamily: "Arial",
        fontWeight: "bold",
        marginBottom: 20
    },
    
    name: {
        fontWeight: "bold",
        textAlign: "center",
    },

    url: {
        flexShrink: 1, //para que la url no se salga de la tarjeta
        textAlign: "center"
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
    },

    generaciones: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 6,
        marginBottom: 15,
    },

    botonGen: {
        backgroundColor: "#2a2a72",
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    botonGenActivo: {
        backgroundColor: "#b8860b",
    }
})