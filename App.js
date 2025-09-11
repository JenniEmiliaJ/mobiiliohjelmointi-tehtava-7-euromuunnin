import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, row } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_KEY } from '@env';

export default function App() {
  const [valutta, setValutta] = useState([]); //valuttakoodit
  const [valuttaData, setValuttaData] = useState({}); // kurssit
  const [valittuValutta, setValittuValutta] = useState('EUR');
  const [muutettavaSumma, setMuutettavaSumma] = useState('0');
  const [tulos, setTulos] = useState('0');

  useEffect(() => {
    // suoritetaan vain kerran
    const handleFetch = () => {
      //haetaan valuttakurssit
      fetch(`https://api.apilayer.com/exchangerates_data/latest`, {
        //annetaan apikey tietojen saamiseksi
        method: 'GET',
        headers: { apikey: API_KEY },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Virhe valuuttojen haussa' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          //tallentaa kursssit objektiin
          setValuttaData(data.rates);
          //luo taulukon valuttakoodien nimistä
          setValutta(Object.keys(data.rates));
        })
        .catch((err) => console.error(err));
    };

    handleFetch();
  }, []);

  const muunnaEuroiksi = () => {
    if (!valuttaData[valittuValutta]) {
      setTulos('0');
      return;
    }
    const numero = parseFloat(muutettavaSumma) || 0;
    const eurot = (numero / valuttaData[valittuValutta]) * valuttaData['EUR'];
    setTulos(eurot.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.vastausText}>{tulos} €</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.textInput}
          placeholder="summa"
          value={muutettavaSumma}
          onChangeText={setMuutettavaSumma}
          keyboardType="numeric"
        />

    
          <Picker
            selectedValue={valittuValutta}
            onValueChange={(itemValue) => setValittuValutta(itemValue)}
            style={{ height: 50, width: 100 }}
          >
            {valutta.map((v) => (
              <Picker.Item key={v} label={v} value={v} />
            ))}
          </Picker>
          
      </View>

      <Button title="CONVERT" onPress={muunnaEuroiksi} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 18,
    width: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 100,
  },
  vastausText: {
    fontSize: 16,
    marginVertical: 4,
  },
});
