import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Keyboard ({ isPortrait, operation, setOperation, result }) {
  const keys = {
    num: [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['.', 0, '=']],
    ops: ['Del', 'C', '/', '*', '-', '+'],
    specOps: ['Sqrt', 'Pow', 'Sin', 'Cos']
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.numView}>
        {
          keys.num.map((e, i) => {
            return (
              <View key={i} style={styles.row}>
                {
                  e.map((num, j) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (typeof num === 'number') {
                            if (operation.length !== 0) {
                              if (operation.at(-1) === ')') return
                              return setOperation(operation + num.toString())
                            }

                            if (num !== 0) {
                              return setOperation(operation + num.toString())
                            }
                          } else if (num === '.' && !isNaN(parseInt(operation.at(-1)))) {
                            for (let i = operation.length - 2; i >= 0; i--) {
                              if (isNaN(parseInt(operation.at(i)))) {
                                if (operation.at(i) !== '.') {
                                  return setOperation(operation + num)
                                }
                                return
                              }
                            }
                            return setOperation(operation + num)
                          } else if (num === '=' && result) {
                            setOperation(result.toString())
                          }
                        }} key={j} style={[styles.numButton, styles.button]}
                      >
                        <Text style={styles.textButton}>{num}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            )
          })
        }
      </View>

      {
        !isPortrait && (
          <View style={styles.opsView}>
            {
              keys.specOps.map((e, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (operation.length === 0) return
                      switch (e) {
                        case 'Sqrt':
                          setOperation('Math.sqrt(' + operation + ')')
                          break
                        case 'Pow':
                          setOperation('Math.pow(' + operation + ', 2)')
                          break
                        case 'Sin':
                          setOperation('Math.sin(' + operation + ')')
                          break
                        case 'Cos':
                          setOperation('Math.cos(' + operation + ')')
                          break
                      }
                    }} key={i} style={[styles.specOpsButton, styles.button]}
                  >
                    <Text>{e}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>)
      }

      <View style={styles.opsView}>
        {
          keys.ops.map((e, i) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  switch (e) {
                    case 'Del':
                      setOperation('')
                      break
                    case 'C':
                      if (operation.at(-1) === ')') {
                        setOperation(operation.slice(0, operation.lastIndexOf('Math.')))
                      } else {
                        setOperation(operation.slice(0, -1))
                      }
                      break
                    case '/':
                    case '*':
                    case '+':
                      if (operation.at(-1) === ')' || !isNaN(parseInt(operation.at(-1)))) {
                        setOperation(operation + e)
                      }
                      break
                    case '-':
                      if (operation.length === 0 || operation.at(-1) === ')' || !isNaN(parseInt(operation.at(-1)))) {
                        setOperation(operation + e)
                      }
                      break
                  }
                }} key={i} style={[styles.opsButton, styles.button]}
              >
                <Text style={styles.textButton}>{e}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },

  mainView: {
    flex: 1,
    flexDirection: 'row'
  },
  numView: {
    flex: 1,
    flexWrap: 'wrap',
    minWidth: 150
  },

  textButton: {
    color: 'white',
    fontSize: 20
  },

  numButton: {
    backgroundColor: 'gray'
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  opsView: {
    flex: 1,
    flexDirection: 'column',
    maxWidth: 150
  },

  opsButton: {
    backgroundColor: 'green'
  },

  specOpsButton: {
    backgroundColor: 'lightgray'
  }
})
