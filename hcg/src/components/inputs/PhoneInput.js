import { StyleSheet, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importa TextInputMask

export default function Input({ type, format, placeHolder, value, onChangeText }) {
  return (
    <TextInputMask
      type={type}
      options={{
        mask: format
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeHolder}
      placeholderTextColor="#ffff" // Color del placeholder para diferenciar del texto
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
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'QuickSand',
  },
});
