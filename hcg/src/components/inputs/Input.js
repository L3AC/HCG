import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Input({ placeHolder, setValor, clave, setTextChange }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeHolder}
      value={setValor}
      placeholderTextColor={'#fff'}
      secureTextEntry={clave}
      onChangeText={setTextChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: '95%',
    paddingVertical: 10,
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'QuickSand',
  },
});
