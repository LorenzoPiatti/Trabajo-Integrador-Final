import "./PanelHeader.css";

function PanelHeader({
    title,
    action,
    onAction
}) {

    return (

        <div className="panel-header">

            <h3>
                {title}
            </h3>

            {
                action && (

                    <button onClick={onAction}>
                        {action}
                    </button>

                )
            }

        </div>

    );

}

export default PanelHeader;