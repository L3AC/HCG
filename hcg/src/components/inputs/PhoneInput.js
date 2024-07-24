import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importa TextInputMask

export default function Input({ type,format,placeHolder, value, onChangeText }) {
  return (
    <TextInputMask
        type={type}
        options={{
        mask: format
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeHolder}
        keyboardType="numeric"
        style={styles.input}
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
