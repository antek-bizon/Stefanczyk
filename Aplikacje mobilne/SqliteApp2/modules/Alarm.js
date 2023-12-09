import Collapsible from 'react-native-collapsible'
import { Pressable, StyleSheet, Vibration, View } from 'react-native'
import { Card, IconButton, Switch, Text, useTheme } from 'react-native-paper'
import { useRef, useState } from 'react'

export default function Alarm ({ item, updateAlarm, removeAlarm, isCollapsed, collapse }) {
  const theme = useTheme()
  const bgColors = [theme.colors.error, theme.colors.tertiaryContainer]
  const [bgColorIndex, setBgColorIndex] = useState(0)
  const timeout = useRef(null)
  if (item.isOn && timeout.current === null) {
    timeout.current = setTimeout(() => {
      timeout.current = null
      setBgColorIndex(prev => (prev + 1) % 2)
    }, 1000)
  }

  const daysOfWeek = ['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB', 'ND']
  const daysOfWeekList = daysOfWeek.map(
    (e, i) => {
      i = (i + 1) % 7
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
    <Card style={[styles.listItem, (item.isOn) ? { backgroundColor: bgColors[bgColorIndex] } : {}]}>
      <View style={styles.row}>
        <Text variant='displaySmall'>{item.time}</Text>
        <View>
          <Switch
            value={item.vibrations} onValueChange={
              () => {
                Vibration.cancel()
                item.vibrations = !item.vibrations
                updateAlarm(item)
              }
            }
          />
          <Switch
            value={item.sound} onValueChange={
              () => {
                item.sound = !item.sound
                updateAlarm(item)
              }
            }
          />
        </View>

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
      <View style={styles.selectedDays}>
        {isCollapsed
          ? item.selectedDays.sort().map((e, i) => (
            <Text key={i}>{daysOfWeek[e]}</Text>
          ))
          : null}
      </View>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.row}>
          {daysOfWeekList}
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
