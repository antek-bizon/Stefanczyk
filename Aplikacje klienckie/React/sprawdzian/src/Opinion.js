import SingleOpinion from "./SingleOpinion"

export default function Opinion({ id, titles, deleteSelf }) {
    const opinions = titles.map((e, i) => { return <SingleOpinion key={i} title={e} /> })
    return <div className="row gap15">
        {opinions}
        <button onClick={() => deleteSelf(id)}>Usuń opinie</button>
    </div>
}
