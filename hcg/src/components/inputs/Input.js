import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Input({ placeHolder, value, clave, onChangeText,multiline=false}) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeHolder}
      value={value}
      placeholderTextColor={'#fff'}
      secureTextEntry={clave}
      onChangeText={onChangeText}
      multiline={multiline}
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
