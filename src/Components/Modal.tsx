import './Modal.css';

export function Modal({ handleClose, show, children }: {handleClose: any, show: boolean, children: any}) {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <button type="button" onClick={handleClose}>
                    Close
                </button>
            </section>
        </div>
    );
}