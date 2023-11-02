import { useCallback, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { Appbar, Button, Menu, useTheme } from 'react-native-paper'
import GalleryItem from './GalleryItem'
import { StyleSheet, View } from 'react-native'
import AppBar from './AppBar'
import IpDialog from './IpDialog'
import LoadingScreen from './LoadingScreen'

export default function Gallery ({ closeApp, images, viewImage, deleteImages, cameraPage }) {
  const [numCol, setNumCol] = useState(3)
  const [selectedImages, setSelectedImages] = useState(new Set())
  const theme = useTheme()
  const [isMenuVisible, setMenuVisible] = useState(false)
  const showMenu = () => setMenuVisible(true)
  const hideMenu = () => setMenuVisible(false)

  const [isDialogVisible, setDialogVisible] = useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

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

  const menu = (
    <Menu
      visible={isMenuVisible}
      onDismiss={hideMenu}
      anchor={<Appbar.Action color={theme.colors.onPrimary} icon='dots-vertical' onPress={showMenu} />}
    >
      <Menu.Item
        title='Set IP' onPress={() => {
          hideMenu()
          showDialog()
        }}
      />
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
        : <LoadingScreen relative />}
      {isDialogVisible
        ? <IpDialog hideDialog={hideDialog} />
        : null}
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    justifyContent: 'space-evenly'
  }
})
