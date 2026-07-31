import "./PanelHeader.css";

function PanelHeader({
    title,
    action
}) {

    return (

        <div className="panel-header">

            <h3>
                {title}
            </h3>

            {
                action && (

                    <button>
                        {action}
                    </button>

                )
            }

        </div>

    );

}

export default PanelHeader;