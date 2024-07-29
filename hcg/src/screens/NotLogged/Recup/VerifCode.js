import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SERVER } from '../../../contexts/Network';
import Header from '../../../components/containers/Header';

const VerifCode = () => {
  const navigation = useNavigation();

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');
  const [number5, setNumber5] = useState('');
  const [number6, setNumber6] = useState('');

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const onChangeText = (text, setNumber, nextInputRef) => {
    if (/^\d$/.test(text)) {
      setNumber(text);
      if (nextInputRef) {
        nextInputRef.current.focus();
      }
    }
    if (number1 && number2 && number3 && number4 && number5 && number6) {
      handlePin();
    }
  };

  const onKeyPress = (e, number, setNumber, prevInputRef, nextInputRef) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (number) {
        setNumber('');
      } else if (prevInputRef) {
        prevInputRef.current.focus();
      }
    } else if (nextInputRef && /^\d$/.test(e.nativeEvent.key)) {
      nextInputRef.current.focus();
    }
  };

  const handlePin = async () => {
    const pin = number1 + number2 + number3 + number4 + number5 + number6;
    if (pin.length === 6) {
      try {
        const formData = new FormData();
        formData.append('pinCliente', pin);
        const response = await fetch(`${SERVER}services/public/clientes.php?action=verifPin`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data);
        if (data.status) {
          navigation.navigate('NuevaClave');
        } else {
          Alert.alert('Error', data.error);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header onPress={() => navigation.goBack()} titulo={'Recuperación'} />
      <View style={styles.container}>
        <Ionicons style={styles.icono} name="shield-checkmark-sharp" size={140} color="black" />
        <Text style={styles.text}>Ingrese el pin enviado a su correo</Text>

        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.input}
            ref={input1Ref}
            onChangeText={(text) => onChangeText(text, setNumber1, input2Ref)}
            onKeyPress={(e) => onKeyPress(e, number1, setNumber1, null, input2Ref)}
            value={number1}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            ref={input2Ref}
            onChangeText={(text) => onChangeText(text, setNumber2, input3Ref)}
            onKeyPress={(e) => onKeyPress(e, number2, setNumber2, input1Ref, input3Ref)}
            value={number2}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            style={styles.input}
            ref={input3Ref}
            onChangeText={(text) => onChangeText(text, setNumber3, input4Ref)}
            onKeyPress={(e) => onKeyPress(e, number3, setNumber3, input2Ref, input4Ref)}
            value={number3}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            style={styles.input}
            ref={input4Ref}
            onChangeText={(text) => onChangeText(text, setNumber4, input5Ref)}
            onKeyPress={(e) => onKeyPress(e, number4, setNumber4, input3Ref, input5Ref)}
            value={number4}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            style={styles.input}
            ref={input5Ref}
            onChangeText={(text) => onChangeText(text, setNumber5, input6Ref)}
            onKeyPress={(e) => onKeyPress(e, number5, setNumber5, input4Ref, input6Ref)}
            value={number5}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
          <TextInput
            style={styles.input}
            ref={input6Ref}
            onChangeText={(text) => {
              onChangeText(text, setNumber6, null);
              if (text.length === 1 && number1 && number2 && number3 && number4 && number5) {
                handlePin();
              }
            }}
            onKeyPress={(e) => onKeyPress(e, number6, setNumber6, input5Ref, null)}
            value={number6}
            placeholder=""
            keyboardType="numeric"
            maxLength={1}
          />
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} onPress={handlePin}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#d2a563',
  },
  text: {
    marginTop: 40,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'QuickSand',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icono: {
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    marginTop: 30,
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 35,
    textAlign: 'center',
    margin: 5,
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 170,
    backgroundColor: '#2F2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'QuickSand',
  },
  containerButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VerifCode;
