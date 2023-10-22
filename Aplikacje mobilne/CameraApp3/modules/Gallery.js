import { useCallback, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { ActivityIndicator, Appbar, Button, Menu, useTheme } from 'react-native-paper'
import GalleryItem from './GalleryItem'
import { StyleSheet, View } from 'react-native'
import AppBar from './AppBar'

export default function Gallery ({ closeApp, images, viewImage, deleteImages, cameraPage, settingsPage }) {
  const [numCol, setNumCol] = useState(3)
  const [selectedImages, setSelectedImages] = useState(new Set())
  const theme = useTheme()

  const startingPage = () => {
    closeApp(false)
  }

  const menuButtons = [
    { title: 'Layout', handlePress: useCallback(() => { if (numCol === 3) setNumCol(1); else setNumCol(3) }, [numCol]) },
    { title: 'Camera', handlePress: cameraPage },
    {
      title: 'Delete',
      handlePress: useCallback(() => {
        const toDelete = Array.from(selectedImages.values())
        if (toDelete.length > 0) {
          setSelectedImages(new Set())
          deleteImages(toDelete)
        }
      }, [selectedImages]),
      isDisabled: typeof selectedImages.values().next().value === 'undefined',
      color: theme.colors.error
    }
  ].map((e, i) => (
    <Button
      key={i}
      disabled={e.isDisabled}
      onPress={e.handlePress}
      mode='contained'
      style={{ backgroundColor: e.color ?? theme.colors.secondary }}
    >{e.title}
    </Button>))

  const selectImage = useCallback((id) => {
    if (selectedImages.has(id)) {
      selectedImages.delete(id)
      setSelectedImages(new Set(selectedImages))
    } else {
      setSelectedImages(new Set(selectedImages.add(id)))
    }
  }, [selectedImages])

  const renderItem = ({ item, index, extraData }) => (
    <GalleryItem
      key={index} image={item}
      selectedImages={extraData}
      selectImage={selectImage}
      viewImage={viewImage}
    />
  )

  const [isMenuVisible, setMenuVisible] = useState(false)

  const showMenu = () => setMenuVisible(true)
  const hideMenu = () => setMenuVisible(false)

  console.log(isMenuVisible)

  const menu = (
    <Menu
      visible={isMenuVisible}
      onDismiss={hideMenu}
      anchor={<Appbar.Action icon='dots-vertical' onPress={showMenu} />}
    >
      <Menu.Item title='Set IP' onPress={settingsPage} />
    </Menu>
  )

  return (
    <>
      <AppBar onPress={startingPage} title='Photos in DCIM' menu={menu} />
      <View style={styles.row}>
        {
          menuButtons
        }
      </View>
      {images
        ? (
          // <FlatList
          //   key={numCol === 3 ? 'grid' : 'list'}
          //   numColumns={numCol}
          //   flex='1'
          //   px='1'
          //   data={images}
          //   keyExtractor={item => item.id}
          //   renderItem={renderItem}
          //   initialNumToRender={3 * 6}
          //   maxToRenderPerBatch={3 * 7}
          // />
          <FlashList
            data={images}
            renderItem={renderItem}
            extraData={selectedImages}
            estimatedItemSize={150}
            numColumns={numCol}
          />)
        : <View style={[styles.center, styles.flex1]}><ActivityIndicator style={styles.spinner} size='large' /></View>}

    </>
  )
}

const styles = StyleSheet.create({
  center: {
    width: '100%',
    textAlign: 'center'
  },

  flex1: {
    flex: 1
  },

  spinner: {
    paddingBottom: 20
  },

  row: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-evenly'
  }
})
