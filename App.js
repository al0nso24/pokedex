import { StyleSheet, View } from 'react-native';
import Home from './src/components/Home';

export default function App() {
  return (
    <View style={styles.container}>
      <Home></Home>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    marginBottom: 30,
    padding: 30
  },
});