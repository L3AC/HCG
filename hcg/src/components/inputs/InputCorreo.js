import { StyleSheet, TextInput } from 'react-native';

export default function InputEmail({ placeHolder, setValor, setTextChange }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeHolder}
      value={setValor}
      placeholderTextColor={'#fff'}
      onChangeText={setTextChange}
      keyboardType="email-address"
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
