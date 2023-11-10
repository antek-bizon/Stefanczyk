import Collapsible from 'react-native-collapsible'
import { Pressable, StyleSheet, View } from 'react-native'
import { Card, IconButton, Switch, Text, useTheme } from 'react-native-paper'

export default function Alarm ({ item, updateAlarm, removeAlarm, isCollapsed, collapse }) {
  const theme = useTheme()

  const daysOfWeek = ['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB', 'ND'].map(
    (e, i) => {
      const isSelected = typeof item.selectedDays.find((e) => e === i) !== 'undefined'
      return (
        <Pressable
          key={i}
          style={{
            borderRadius: 50,
            padding: 10,
            backgroundColor: (isSelected) ? theme.colors.inversePrimary : null
          }}
          onPress={() => {
            if (isSelected) {
              item.selectedDays = item.selectedDays.filter((f) => f !== i)
            } else {
              item.selectedDays.push(i)
            }
            updateAlarm(item)
          }}
        >
          <Text>{e}</Text>
        </Pressable>
      )
    }
  )

  return (
    <Card style={styles.listItem}>
      <View style={styles.row}>
        <Text variant='displaySmall'>{item.time}</Text>
        <Switch
          value={item.isSelected} onValueChange={
            () => {
              item.isSelected = !item.isSelected
              updateAlarm(item)
            }
          }
        />
      </View>
      <View style={styles.row}>
        <IconButton
          icon='delete' onPress={() => removeAlarm(item.id)}
        />
        <IconButton
          icon={isCollapsed ? 'arrow-down' : 'arrow-up'} onPress={() => {
            collapse(item.id)
          }}
        />
      </View>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.row}>
          {daysOfWeek}
        </View>
      </Collapsible>
    </Card>
  )
}

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
