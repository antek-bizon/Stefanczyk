const Dialog = ({ index, deleteSelected, changeVisibility }) => {
    return <dialog open>
        <h2>Chcesz usunąć?</h2>
        <button onClick={() => deleteSelected(index)} >Usuń</button>
        <button onClick={() => changeVisibility()}>Anuluj</button>
    </dialog>
}

export default Dialog