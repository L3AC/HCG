import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputLogin = ({ placeHolder, value, onChangeText, clave, isContra, setIsContra }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeHolder}
        placeholderTextColor="#fff"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={clave}
      />
      {isContra && (
        <TouchableOpacity style={styles.icon} onPress={() => setIsContra(!clave)}>
          <Ionicons name={clave ? 'eye-off' : 'eye'} size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: '95%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    fontSize: 20,
    color: '#fff',
    fontFamily: 'QuickSand'
  },
  icon: {
    paddingLeft: 10,
  },
});

export default InputLogin;
