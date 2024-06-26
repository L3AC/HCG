
import { StyleSheet, Text, View,TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Input({placeHolder, setValor, clave, setTextChange}) {

return (

    <TextInput
    style={styles.Input}
    placeholder={placeHolder}
    value={setValor}
    placeholderTextColor={'#FFF'}
    secureTextEntry={clave} 
    onChangeText={setTextChange}
    />

    );
}

const styles = StyleSheet.create({
    Input: {
        width: '100%',
        color: "#fff", fontWeight:'800',
        height: 50, // Ajusta la altura según sea necesario
        borderRadius: 8, // Redondeo de los bordes
        backgroundColor: '#AA6231', // Color de fondo del input
        paddingHorizontal: 15,
        marginBottom: 20,
        color: '#ffffff',
        fontFamily: 'QuickSand',
        //fontFamily: 'QuickSand'// Ajusta el color del texto según el fondo
    },

});