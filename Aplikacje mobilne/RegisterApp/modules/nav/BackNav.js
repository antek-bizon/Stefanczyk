import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components'

const BackNav = ({ title, onPress }) => {
  const backIcon = (props) => (
    <Icon {...props} name='arrow-back' />
  )

  const backAction = () => (
    <TopNavigationAction onPress={() => onPress()} icon={backIcon} />
  )

  return (
    <TopNavigation title={title} accessoryLeft={backAction} />
  )
}

export default BackNav
