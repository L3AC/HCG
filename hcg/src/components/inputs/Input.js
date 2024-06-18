
import { StyleSheet, Text, View,TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Input({placeHolder, setValor, clave, setTextChange}) {

return (

    <TextInput
    style={styles.Input}
    placeholder={placeHolder}
    value={setValor}
    placeholderTextColor={'#000'}
    secureTextEntry={clave} 
    onChangeText={setTextChange}
    />

    );
}

const styles = StyleSheet.create({
    Input: {
        marginBottom: 6,
        marginTop: 6,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#F2E7CF'
    },

});