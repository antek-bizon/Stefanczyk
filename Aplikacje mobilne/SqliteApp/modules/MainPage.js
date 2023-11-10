import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Card, FAB, IconButton, Switch, Text, useTheme } from 'react-native-paper'

export default function MainPage ({ navigation }) {
  const theme = useTheme()
  const [alarms, setAlarms] = useState([])

  const addAlarm = () => {
    const newAlarm = {
      time: '00:00',
      isSelected: false,
      collapsed: true,
      selectedDays: []
    }
    setAlarms([...alarms, newAlarm])
  }

  const renderItem = ({ item }) => {
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
              setAlarms([...alarms])
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
              setAlarms([...alarms])
            }
          }
          />
        </View>
        <View style={styles.row}>
          <IconButton
            icon='delete' onPress={() => setAlarms(
              alarms.filter(e => e !== item)
            )}
          />
          <IconButton
            icon={item.collapsed ? 'arrow-down' : 'arrow-up'} onPress={() => {
              item.collapsed = !item.collapsed
              setAlarms([...alarms])
            }}
          />
        </View>
        <Collapsible collapsed={item.collapsed}>
          <View style={styles.row}>
            {daysOfWeek}
          </View>
        </Collapsible>
      </Card>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
      <FlashList
        renderItem={renderItem}
        data={alarms}
        estimatedItemSize={170}
        numColumns={1}
      />
      <FAB
        icon='plus' style={styles.fab}
        onPress={() => navigation.navigate('Add alarm page', { onAdd: addAlarm })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 20
  },
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
