import "./PopUp.css"

export default function PopUp({ popUpText }) {
    
    return (
        <div className="popup">
            <h2>Tytuł alertu</h2>
            <p>{popUpText}</p>
        </div>
    )
}