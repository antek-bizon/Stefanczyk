import Collapsible from 'react-native-collapsible'
import { StyleSheet, Vibration, View } from 'react-native'
import { Card, IconButton, Switch, Text, TouchableRipple, useTheme } from 'react-native-paper'
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
        <View key={i} style={styles.touchableContainer}>
          <TouchableRipple
            style={[styles.touchable, {
              backgroundColor: (isSelected) ? theme.colors.inversePrimary : null
            }]}
            rippleColor={theme.colors.primary}
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
          </TouchableRipple>
        </View>
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
          ? item.selectedDays.sort((a, b) => {
            if (a === 0) {
              return 1
            }
            if (b === 0) {
              return -1
            }
            if (a > b) {
              return 1
            }
            if (a < b) {
              return -1
            }
            return 0
          }).map((e, i) => (
            <Text key={i}>{daysOfWeek[(e - 1) >= 0 ? (e - 1) : daysOfWeek.length - 1]}</Text>
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
  },
  selectedDays: {
    height: 40,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15
  },
  touchableContainer: {
    overflow: 'hidden',
    borderRadius: 50
  },
  touchable: {
    padding: 10
  }
})
