import { Pressable, StyleSheet, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

export default function Radio ({ title, items, selected, onSelect }) {
  const theme = useTheme()

  return (
    <View>
      <View style={styles.main}>
        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>{title}</Text>
        {items.map((e, i) => (
          <Pressable key={i} style={styles.item} onPress={() => onSelect(e)}>
            {selected === e || selected === i ? <View style={[styles.circle, { backgroundColor: theme.colors.primary }]} /> : <View style={styles.circle} />}
            <Text style={[{ color: theme.colors.onPrimary }]}>{e}</Text>
          </Pressable>
        ))}
      </View>
      <Divider style={{ borderColor: 'white' }} />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    padding: 15,
    gap: 7
  },

  title: {
    textAlign: 'center'
  },

  item: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 5
  }
})
