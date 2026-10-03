import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//pokemon = el objeto completo con toda la información
//onVolver = se ejecuta para volver al inicio
//Recibe el Pokémon y la función para volver
export default function DetallePokemon({ pokemon, onVolver }) {
    //? = protege por si sprites no existe o es null
    const imagen = pokemon.sprites?.front_default; //sprite que viene en la api

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
            onPress={onVolver}
            style={styles.botonVolver}
            >
                <Text style={{color: "white", fontWeight:"bold"}}>Volver a la lista</Text>
            </TouchableOpacity>

            <View style={styles.encabezado}>
                <Image source={{ uri: imagen }} style={styles.imagen}></Image>
                <Text style={styles.nombre}>{pokemon.name}</Text>
                <Text style={styles.numero}>N° {pokemon.id}</Text>
            </View>

            <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>Tipo</Text>
                <View style={styles.listaTipos}>
                    {pokemon.types?.map(({ type }) => (
                        <Text key={type.name} style={styles.tipo}>
                            {type.name}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>Habilidades</Text>
                {/*is_hidden = está oculto*/}
                {pokemon.abilities?.map(({ ability, is_hidden }) => (
                    <Text key={ability.name} style={styles.linea}>
                        {ability.name}{is_hidden ? " (oculta)" : ""}
                    </Text>
                ))}
            </View>

            <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>Estadísticas</Text>
                {pokemon.stats?.map(({ base_stat, stat }) => (
                    <View key={stat.name} style={styles.estadistica}>
                        <View style={styles.filaEstadistica}>
                            <Text style={styles.nombreEstadistica}>{stat.name}</Text>
                            <Text style={styles.valor}>{base_stat}</Text>
                        </View>
                        <View style={styles.fondoBarra}>
                            <View
                                style={[
                                    styles.barra,
                                    //base_stat / 255 = convierte el valor a porcentaje
                                    //* 100  = para pasarlo a porcentaje
                                    //Math.min(..., 100) = para que nunca pase el 100%
                                    //se pone en width para hacer la barra visual
                                    { width: `${Math.min((base_stat / 255) * 100, 100)}%` },
                                ]}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    botonVolver: {
        alignSelf: "flex-start",
        backgroundColor: "#2a2a72",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    encabezado: {
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
    },

    imagen: {
        height: 165,
        width: 165,
    },

    nombre: {
        fontSize: 28,
        fontWeight: "bold",
        textTransform: "capitalize", //le pone una mayúscula inicial al nombre
    },

    numero: {
        color: "#666",
        marginTop: 4,
    },

    seccion: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        padding: 16,
    },

    tituloSeccion: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textTransform: "capitalize", //le pone una mayúscula inicial al nombre
    },

    listaTipos: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    tipo: {
        backgroundColor: "#e8e4ff",
        borderRadius: 16,
        color: "#4435a5",
        overflow: "hidden",
        paddingHorizontal: 12,
        paddingVertical: 6,
        textTransform: "capitalize", //le pone una mayúscula inicial al nombre
    },

    datos: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12,
    },

    dato: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        flexGrow: 1,
        minWidth: "45%",
        padding: 12,
    },

    etiqueta: {
        color: "#666",
        fontSize: 12,
        marginBottom: 4,
    },

    valor: {
        fontWeight: "bold",
    },

    linea: {
        marginBottom: 6,
        textTransform: "capitalize", //le pone una mayúscula inicial al nombre
    },

    estadistica: {
        marginBottom: 12,
    },

    filaEstadistica: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    nombreEstadistica: {
        textTransform: "capitalize", //le pone una mayúscula inicial al nombre
    },

    fondoBarra: {
        backgroundColor: "#e5e5e5",
        borderRadius: 5,
        height: 8,
        overflow: "hidden",
    },

    //Esto se llena según la estadística
    barra: {
        backgroundColor: "#5b4bdb",
        borderRadius: 5,
        height: "100%",
    }
});